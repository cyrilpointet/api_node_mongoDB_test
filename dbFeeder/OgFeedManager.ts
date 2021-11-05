/* eslint-disable no-async-promise-executor */

import { Feed } from "../server/models/Feed";
import { Member } from "../server/models/Member";
import { ogFeedType } from "./ApiTypes";
import { ApiCrawler } from "./ApiCrawler";
import { OgCommentManager } from "./OgCommentManager";
//import { OgCommentManager } from "./OgCommentManager";

export class OgFeedManager {
  public static manageApiData(ogResp, groupId): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const feeds = ogResp.data;
      for (let i = 0; i < feeds.length; i++) {
        process.stdout.write(".");
        try {
          await this.upsertFeed(feeds[i], groupId);
        } catch (e) {
          console.error(`invalid data member ${feeds[i].id}`);
          reject(e);
        }
      }
      if (ogResp.paging?.next && ogResp.paging?.cursors) {
        try {
          const newResp = await ApiCrawler.getDataFromApiUrl(
            ogResp.paging.next
          );
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
        resolve(updatedFeed);
      } catch (e) {
        reject(e);
      }

      if (rawFeed.comments) {
        try {
          await OgCommentManager.manageApiData(
            rawFeed.comments,
            updatedFeed.id
          );
        } catch (e) {
          reject(e);
        }
      }
      resolve(updatedFeed);
    });
  }
}
