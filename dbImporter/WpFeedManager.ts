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
  public static async importFeedsByGroup(group: Group): Promise<void> {
    const url = new URL(group.wpId + "/feed", process.env.OG_BASE_URL);
    url.searchParams.set("limit", FEED_LIMIT.toString());
    url.searchParams.set("fields", FEED_FIElDS.join());
    const { data } = await WpApiCrawler.getDataFromApiUrl(url);
    await this.manageApiData(data, group.id);
  }

  private static async manageApiData(
    wpResp: wpFeedRouteResponseType,
    groupId: string
  ): Promise<void> {
    for (let i = 0; i < wpResp.data.length; i++) {
      try {
        await this.upsertFeed(wpResp.data[i], groupId);
        CrawlerReporter.feeds++;
      } catch (e) {
        CrawlerReporter.feedErrors++;
      }
      CrawlerReporter.printShortReport();
    }

    if (wpResp.paging?.next && wpResp.paging?.cursors) {
      const formatedUrl = new URL(wpResp.paging.next);
      formatedUrl.searchParams.set("limit", FEED_LIMIT.toString());
      const newResp = await WpApiCrawler.getDataFromApiUrl(formatedUrl);
      await this.manageApiData(newResp.data, groupId);
    }
  }

  private static async upsertFeed(
    rawFeed: wpFeedType,
    groupId: string
  ): Promise<Feed> {
    const filter = { wpId: rawFeed.id };
    let author = await Member.findOne({ wpId: rawFeed.from.id });

    // Si le membre est inconnu, on essaie de l'importer
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
    const updatedFeed = await Feed.findOneAndUpdate(filter, updatedValues, {
      new: true,
      upsert: true,
    });

    if (rawFeed.comments) {
      await WpCommentManager.manageApiData(rawFeed.comments, updatedFeed.id);
    }
    return updatedFeed;
  }
}
