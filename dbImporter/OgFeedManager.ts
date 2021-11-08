/* eslint-disable no-async-promise-executor */

import { Feed } from "../server/models/Feed";
import { Member } from "../server/models/Member";
import { Group } from "../server/models/Group";
import { ogFeedRouteResponseType, ogFeedType } from "./ApiTypes";
import { ApiCrawler } from "./ApiCrawler";
import { OgCommentManager } from "./OgCommentManager";
import { OgMemberManager } from "./OgMemberManager";

const FEED_LIMIT = 500;

const COMMENT_FIELDS = ["message", "from", "created_time"];

const FEED_FIElDS = [
  "from",
  "type",
  "story",
  "message",
  "full_picture",
  "created_time",
  "updated_time",
  "to",
  `comments.fields(${COMMENT_FIELDS.join()}).limit(10)`,
];

export class OgFeedManager {
  public static feedError = 0;
  public static unknownUsers = 0;

  public static importFeedsByGroup(group: Group): Promise<void> {
    this.feedError = this.unknownUsers = 0;
    process.stdout.write("Feed and comments: ");
    return new Promise(async (resolve, reject) => {
      const url = new URL(group.ogId + "/feed", process.env.OG_BASE_URL);
      url.searchParams.set("limit", FEED_LIMIT.toString());
      url.searchParams.set("fields", FEED_FIElDS.join());
      try {
        const { data } = await ApiCrawler.getDataFromApiUrl(url);
        await this.manageApiResponse(data, group.id);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private static manageApiResponse(
    wpResp: ogFeedRouteResponseType,
    groupId: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.interateEntries(wpResp.data, groupId);

      if (wpResp.paging?.next && wpResp.paging?.cursors) {
        try {
          const formatedUrl = new URL(wpResp.paging.next);
          formatedUrl.searchParams.set("limit", FEED_LIMIT.toString());
          const newResp = await ApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiResponse(newResp.data, groupId);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        console.log(
          ` done with ${this.feedError} errors and ${this.unknownUsers} unknown members`
        );
        resolve();
      }
    });
  }

  private static interateEntries(
    feeds: ogFeedType[],
    groupId: string
  ): Promise<void> {
    return new Promise(async (resolve) => {
      for (let i = 0; i < feeds.length; i++) {
        process.stdout.write(".");
        try {
          await this.upsertFeed(feeds[i], groupId);
        } catch (e) {
          this.feedError++;
        }
      }
      resolve();
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
        let author = await Member.findOne({ ogId: rawFeed.from.id });
        // Si le membre est inconnu, on essai de l'importer
        if (!author) {
          try {
            author = await OgMemberManager.importMemberFromId(rawFeed.from.id);
          } catch {
            author = null;
            this.unknownUsers++;
          }
        }

        const updatedValues = {
          type: rawFeed.type,
          story: rawFeed.story ? rawFeed.story : null,
          message: rawFeed.message,
          pictureLink: rawFeed.full_picture ? rawFeed.full_picture : null,
          createdAt: rawFeed.created_time,
          updatedAt: rawFeed.updated_time,
          ogId: rawFeed.id,
          author: author._id ? author._id : null,
          group: groupId,
        };
        updatedFeed = await Feed.findOneAndUpdate(filter, updatedValues, {
          new: true,
          upsert: true,
        });
      } catch (e) {
        reject(e);
        return;
      }

      if (rawFeed.comments) {
        try {
          await OgCommentManager.manageApiResponse(
            rawFeed.comments,
            updatedFeed.id
          );
          resolve(updatedFeed);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(updatedFeed);
      }
    });
  }
}
