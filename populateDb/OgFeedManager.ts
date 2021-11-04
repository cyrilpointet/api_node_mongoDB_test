/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Group } from "../server/models/Group";
import { Feed } from "../server/models/Feed";
import { Member } from "../server/models/Member";
import { ogFeedRouteResponseType, ogFeedType } from "./ApiTypes";

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
      // Supprime le groupe de la liste des groupes de tous les posts
      await Feed.updateMany({ group: group._id }, { group: null });

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
      process.stdout.write(".");
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
        try {
          const updatedFeed = await this.upsertFeed(feeds[i], groupId);
          await updatedFeed.save();
        } catch (e) {
          reject(e);
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
      try {
        const filter = { ogId: rawFeed.id };
        const updatedValues = {
          type: rawFeed.type,
          story: rawFeed.story ? rawFeed.story : null,
          message: rawFeed.message,
          pictureLink: rawFeed.full_picture ? rawFeed.full_picture : null,
          createdAt: rawFeed.created_time,
          updatedAt: rawFeed.updated_time,
          ogId: rawFeed.id,
        };
        const updatedFeed = await Feed.findOneAndUpdate(filter, updatedValues, {
          new: true,
          upsert: true,
        });
        const author = await Member.find({ ogId: rawFeed.from.id });
        updatedFeed.author = author.id;
        updatedFeed.group = groupId;
        await updatedFeed.save();
        resolve(updatedFeed);
      } catch (e) {
        reject(e);
      }
    });
  }
}
