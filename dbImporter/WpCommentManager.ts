/* eslint-disable no-async-promise-executor */

import { WpApiCrawler } from "./WpApiCrawler";
import { Member } from "../server/models/Member";
import { wpCommentRouteResponseType, wpCommentType } from "./wpApiTypes";
import { Comment } from "../server/models/Comment";
import { WpMemberManager } from "./WpMemberManager";
import { CrawlerReporter } from "./CrawlerReporter";

const API_LIMIT = 500;

export class WpCommentManager {
  public static async manageApiData(
    ogResp: wpCommentRouteResponseType,
    feedId: string
  ): Promise<void> {
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
      const formatedUrl = new URL(ogResp.paging.next);
      formatedUrl.searchParams.set("limit", API_LIMIT.toString());
      const newResp = await WpApiCrawler.getDataFromApiUrl(formatedUrl);
      await this.manageApiData(newResp.data, feedId);
    }
  }

  private static async upsertComment(
    rawComment: wpCommentType,
    feedId: string
  ): Promise<Comment> {
    const filter = { wpId: rawComment.id };
    let author = await Member.findOne({ wpId: rawComment.from.id });
    // Si le membre est inconnu, on essai de l'importer
    if (!author) {
      try {
        author = await WpMemberManager.importMemberFromId(rawComment.from.id);
      } catch {
        author = null;
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
    return updatedComment;
  }
}
