/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Feed } from "../server/models/Feed";
import { Member } from "../server/models/Member";
import { ogCommentRouteResponseType, ogCommentType } from "./ApiTypes";
import { Comment } from "../server/models/Comment";

const COMMENT_PARAMS = ["message", "from", "created_time"];

export class OgCommentManager {
  public static populateFeedComments(feed: Feed): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Supprime le groupe de la liste des groupes de tous les posts
      await Comment.updateMany({ feed: feed._id }, { feed: null });

      try {
        await this.crawlFeedComments(feed._id, feed.ogId + "/comments");
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private static crawlFeedComments(
    feedId: string,
    url: string,
    since: string | null = null,
    until: string | null = null,
    pagingToken: string | null = null
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let resp: ogCommentRouteResponseType;
      try {
        resp = await ApiCrawler.getDataFromWpApi(
          url,
          500,
          COMMENT_PARAMS,
          null,
          since,
          until,
          pagingToken
        );
      } catch (e) {
        reject(e);
        return;
      }

      const comments = resp.data;
      for (let i = 0; i < comments.length; i++) {
        process.stdout.write("c");
        try {
          await this.upsertComment(comments[i], feedId);
        } catch (e) {
          console.error(`invalid data comment ${comments[i].id}`);
        }
      }

      if (resp.paging?.next) {
        try {
          const parsedUrl = new URL(resp.paging.next);
          const newSince = parsedUrl.searchParams.get("since");
          const newUntil = parsedUrl.searchParams.get("until");
          const newPagingToken = parsedUrl.searchParams.get("__paging_token");
          await this.crawlFeedComments(
            feedId,
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
        resolve();
      }
    });
  }

  private static upsertComment(
    rawComment: ogCommentType,
    feedId: string
  ): Promise<Comment> {
    return new Promise(async (resolve, reject) => {
      try {
        const filter = { ogId: rawComment.id };
        const updatedValues = {
          message: rawComment.message,
          createdAt: rawComment.created_time,
          ogId: rawComment.id,
        };
        const updatedComment = await Comment.findOneAndUpdate(
          filter,
          updatedValues,
          {
            new: true,
            upsert: true,
          }
        );
        const author = await Member.find({ ogId: rawComment.from.id });
        updatedComment.author = author.id;
        updatedComment.feed = feedId;
        await updatedComment.save();
        resolve(updatedComment);
      } catch (e) {
        reject(e);
      }
    });
  }
}
