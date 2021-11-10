/* eslint-disable no-async-promise-executor */

import { WpApiCrawler } from "./WpApiCrawler";
import { Member } from "../server/models/Member";
import { wpCommentRouteResponseType, wpCommentType } from "./wpApiTypes";
import { Comment } from "../server/models/Comment";
import { WpMemberManager } from "./WpMemberManager";
import { WpFeedManager } from "./WpFeedManager";
import { CrawlerReporter } from "./CrawlerReporter";

const API_LIMIT = 500;

export class WpCommentManager {
  public static manageApiResponse(
    ogResp: wpCommentRouteResponseType,
    feedId: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const comments = ogResp.data;
      for (let i = 0; i < comments.length; i++) {
        try {
          await this.upsertComment(comments[i], feedId);
          CrawlerReporter.comments++;
        } catch (e) {
          CrawlerReporter.commentErrors++;
        }
        CrawlerReporter.printShortReport();
      }
      if (ogResp.paging?.next && ogResp.paging?.cursors) {
        try {
          const formatedUrl = new URL(ogResp.paging.next);
          formatedUrl.searchParams.set("limit", API_LIMIT.toString());
          const newResp = await WpApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiResponse(newResp.data, feedId);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }

  private static upsertComment(
    rawComment: wpCommentType,
    feedId: string
  ): Promise<Comment> {
    return new Promise(async (resolve, reject) => {
      try {
        const filter = { wpId: rawComment.id };
        let author = await Member.findOne({ wpId: rawComment.from.id });
        // Si le membre est inconnu, on essai de l'importer
        if (!author) {
          try {
            author = await WpMemberManager.importMemberFromId(
              rawComment.from.id
            );
          } catch {
            author = null;
            WpFeedManager.unknownUsers++;
            CrawlerReporter.memberErrors++;
          }
        }
        const updatedValues = {
          message: rawComment.message,
          createdAt: rawComment.created_time,
          wpId: rawComment.id,
          author: author._id ? author._id : null,
          feed: feedId,
        };
        const updatedComment = await Comment.findOneAndUpdate(
          filter,
          updatedValues,
          {
            new: true,
            upsert: true,
          }
        );
        resolve(updatedComment);
      } catch (e) {
        reject(e);
      }
    });
  }
}
