/* eslint-disable no-async-promise-executor */

import { Feed } from "../server/models/Feed";
import { Member } from "../server/models/Member";
import { ogFeedRouteResponseType, ogFeedType } from "./ApiTypes";
import { ApiCrawler } from "./ApiCrawler";
import { OgCommentManager } from "./OgCommentManager";

const API_LIMIT = 500;

const COMMENT_FIELDS = ["message", "from", "created_time"];

const FEED_FIElDS = [
  "from",
  "type",
  "story",
  "message",
  "full_picture",
  "created_time",
  "updated_time",
  `comments.fields(${COMMENT_FIELDS.join()}).limit(10)`,
];

export class OgFeedManager {
  public static manageApiData(
    ogResp: ogFeedRouteResponseType,
    groupId: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const feeds = ogResp.data;
      for (let i = 0; i < feeds.length; i++) {
        process.stdout.write(".");
        try {
          await this.upsertFeed(feeds[i], groupId);
        } catch (e) {
          console.error(`invalid data feed ${feeds[i].id}`);
          reject(e);
        }
      }
      if (ogResp.paging?.next && ogResp.paging?.cursors) {
        try {
          const formatedUrl = new URL(ogResp.paging.next);
          formatedUrl.searchParams.set("limit", API_LIMIT.toString());
          const newResp = await ApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiData(newResp.data, groupId);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }

  public static setOriginalQuery(groupId: string): ogFeedRouteResponseType {
    return {
      data: [],
      paging: {
        cursors: {
          before: "",
          after: "",
        },
        previous: "",
        next: `${
          process.env.OG_BASE_URL
        }/${groupId}/feed?limit=500&fields=${FEED_FIElDS.join()}`,
      },
    };
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
        return;
      }

      if (rawFeed.comments) {
        try {
          await OgCommentManager.manageApiData(
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
