/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Member } from "../server/models/Member";
import { ogCommentRouteResponseType, ogCommentType } from "./ApiTypes";
import { Comment } from "../server/models/Comment";

const API_LIMIT = 500;

export class OgCommentManager {
  public static manageApiData(
    ogResp: ogCommentRouteResponseType,
    feedId: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const comments = ogResp.data;
      for (let i = 0; i < comments.length; i++) {
        process.stdout.write("c");
        try {
          await this.upsertComment(comments[i], feedId);
        } catch (e) {
          console.error(`invalid data comment ${comments[i].id}`);
        }
      }
      if (ogResp.paging?.next && ogResp.paging?.cursors) {
        try {
          const formatedUrl = new URL(ogResp.paging.next);
          formatedUrl.searchParams.set("limit", API_LIMIT.toString());
          const newResp = await ApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiData(newResp.data, feedId);
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
        const author = await Member.findOne({ ogId: rawComment.from.id });
        const updatedValues = {
          message: rawComment.message,
          createdAt: rawComment.created_time,
          ogId: rawComment.id,
          author: author._id,
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
