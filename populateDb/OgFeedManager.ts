/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Group } from "../server/models/Group";
import { Feed } from "../server/models/Feed";
import { Member } from "../server/models/Member";
import { ogFeedRouteResponseType, ogFeedType } from "./ApiTypes";
import { OgCommentManager } from "./OgCommentManager";

const FEED_PARAMS = [
  "from",
  "type",
  "story",
  "message",
  "full_picture",
  "created_time",
  "updated_time",
];

export class OgFeedManager {
  public static populateGroupFeeds(group: Group): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.crawlGroupFeeds(group._id, group.ogId + "/feed");
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private static crawlGroupFeeds(
    groupId: string,
    url: string,
    since: string | null = null,
    until: string | null = null,
    pagingToken: string | null = null
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let resp: ogFeedRouteResponseType;
      try {
        resp = await ApiCrawler.getDataFromWpApi(
          url,
          500,
          FEED_PARAMS,
          null,
          since,
          until,
          pagingToken
        );
      } catch (e) {
        reject(e);
        return;
      }

      const feeds = resp.data;
      for (let i = 0; i < feeds.length; i++) {
        process.stdout.write(".");
        try {
          await this.upsertFeed(feeds[i], groupId);
        } catch (e) {
          console.error(`invalid data feed ${feeds[i].id}`);
        }
      }

      if (resp.paging) {
        try {
          const parsedUrl = new URL(resp.paging.next);
          const newSince = parsedUrl.searchParams.get("since");
          const newUntil = parsedUrl.searchParams.get("until");
          const newPagingToken = parsedUrl.searchParams.get("__paging_token");
          await this.crawlGroupFeeds(
            groupId,
            url,
            newSince,
            newUntil,
            newPagingToken
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        console.log(" done");
        resolve();
      }
    });
  }

  private static upsertFeed(
    rawFeed: ogFeedType,
    groupId: string
  ): Promise<Feed> {
    return new Promise(async (resolve, reject) => {
      let updatedFeed;
      try {
        const filter = { ogId: rawFeed.id };
        const author = await Member.findOne({ ogId: rawFeed.from.id });
        const updatedValues = {
          type: rawFeed.type,
          story: rawFeed.story ? rawFeed.story : null,
          message: rawFeed.message,
          pictureLink: rawFeed.full_picture ? rawFeed.full_picture : null,
          createdAt: rawFeed.created_time,
          updatedAt: rawFeed.updated_time,
          ogId: rawFeed.id,
          author: author._id,
          group: groupId,
        };
        updatedFeed = await Feed.findOneAndUpdate(filter, updatedValues, {
          new: true,
          upsert: true,
        });
      } catch (e) {
        reject(e);
      }

      // Récupération des comments
      try {
        await OgCommentManager.populateFeedComments(updatedFeed);
        resolve(updatedFeed);
      } catch (e) {
        reject(e);
      }
    });
  }
}
