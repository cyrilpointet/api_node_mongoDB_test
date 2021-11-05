/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Feed } from "../server/models/Feed";
import { Member } from "../server/models/Member";
import { ogCommentRouteResponseType, ogCommentType } from "./ApiTypes";
import { Comment } from "../server/models/Comment";

const COMMENT_PARAMS = ["message", "from", "created_time"];

export class OgCommentManager {
  public static manageApiData(ogResp, feedId): Promise<void> {
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
          const newResp = await ApiCrawler.getDataFromApiUrl(
            ogResp.paging.next
          );
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
