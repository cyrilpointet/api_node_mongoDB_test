/* eslint-disable no-async-promise-executor */

import { Feed } from "../server/models/Feed";
import { Member } from "../server/models/Member";
import { Group } from "../server/models/Group";
import { wpFeedRouteResponseType, wpFeedType } from "./wpApiTypes";
import { WpApiCrawler } from "./WpApiCrawler";
import { WpCommentManager } from "./WpCommentManager";
import { WpMemberManager } from "./WpMemberManager";
import { CrawlerReporter } from "./CrawlerReporter";

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

export class WpFeedManager {
  public static importFeedsByGroup(group: Group): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const url = new URL(group.wpId + "/feed", process.env.OG_BASE_URL);
      url.searchParams.set("limit", FEED_LIMIT.toString());
      url.searchParams.set("fields", FEED_FIElDS.join());
      try {
        const { data } = await WpApiCrawler.getDataFromApiUrl(url);
        await this.manageApiResponse(data, group.id);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private static manageApiResponse(
    wpResp: wpFeedRouteResponseType,
    groupId: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.interateEntries(wpResp.data, groupId);

      if (wpResp.paging?.next && wpResp.paging?.cursors) {
        try {
          const formatedUrl = new URL(wpResp.paging.next);
          formatedUrl.searchParams.set("limit", FEED_LIMIT.toString());
          const newResp = await WpApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiResponse(newResp.data, groupId);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }

  private static interateEntries(
    feeds: wpFeedType[],
    groupId: string
  ): Promise<void> {
    return new Promise(async (resolve) => {
      for (let i = 0; i < feeds.length; i++) {
        try {
          await this.upsertFeed(feeds[i], groupId);
          CrawlerReporter.feeds++;
        } catch (e) {
          CrawlerReporter.feedErrors++;
        }
      }
      CrawlerReporter.printShortReport();
      resolve();
    });
  }

  private static upsertFeed(
    rawFeed: wpFeedType,
    groupId: string
  ): Promise<Feed> {
    return new Promise(async (resolve, reject) => {
      let updatedFeed;
      try {
        const filter = { wpId: rawFeed.id };
        let author = await Member.findOne({ wpId: rawFeed.from.id });
        // Si le membre est inconnu, on essai de l'importer
        if (!author) {
          try {
            author = await WpMemberManager.importMemberFromId(rawFeed.from.id);
            CrawlerReporter.members++;
          } catch {
            author = null;
            CrawlerReporter.memberErrors++;
          }
        }

        const updatedValues = {
          type: rawFeed.type,
          story: rawFeed.story ? rawFeed.story : null,
          message: rawFeed.message,
          pictureLink: rawFeed.full_picture ? rawFeed.full_picture : null,
          createdAt: rawFeed.created_time,
          updatedAt: rawFeed.updated_time,
          wpId: rawFeed.id,
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
          await WpCommentManager.manageApiResponse(
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
