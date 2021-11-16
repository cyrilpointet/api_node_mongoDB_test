/* eslint-disable no-async-promise-executor */

import { Group } from "../server/models/Group";
import { Member } from "../server/models/Member";
import { Feed } from "../server/models/Feed";
import { Comment } from "../server/models/Comment";

type dbStateType = {
  groups: number;
  members: number;
  feeds: number;
  comments: number;
};

export class CrawlerReporter {
  public static apiCalls = 0;
  public static apiErrors = 0;
  public static groups = 0;
  public static members = 0;
  public static feeds = 0;
  public static comments = 0;
  public static groupErrors = 0;
  public static memberErrors = 0;
  public static feedErrors = 0;
  public static commentErrors = 0;

  private static getDbState(): Promise<dbStateType> {
    return new Promise(async (resolve) => {
      const groups = await Group.find({}).count();
      const members = await Member.find({}).count();
      const feeds = await Feed.find({}).count();
      const comments = await Comment.find({}).count();
      resolve({
        groups,
        members,
        feeds,
        comments,
      });
    });
  }

  public static printShortReport(): void {
    process.stdout.write(
      `\rApi calls: \x1b[32m${this.apiCalls}\x1b[0m - \x1b[31m${this.apiErrors}\x1b[0m, groups: \x1b[32m${this.groups}\x1b[0m - \x1b[31m${this.groupErrors}\x1b[0m, members: \x1b[32m${this.members}\x1b[0m - \x1b[31m${this.memberErrors}\x1b[0m, feeds: \x1b[32m${this.feeds}\x1b[0m - \x1b[31m${this.feedErrors}\x1b[0m, comments: \x1b[32m${this.comments}\x1b[0m - \x1b[31m${this.commentErrors}\x1b[0m`
    );
  }

  public static printCompleteReport(): Promise<void> {
    return new Promise(async (resolve) => {
      const dbState = await this.getDbState();
      console.log("****** Terminated ******");
      console.log(
        `Passed \x1b[32m${this.apiCalls}\x1b[0m calls with \x1b[31m${this.apiErrors}\x1b[0m errors`
      );
      console.log("Entries updated:");
      console.log(
        `\x1b[32m${this.groups}\x1b[0m groups with \x1b[31m${this.groupErrors}\x1b[0m errors`
      );
      console.log(
        `\x1b[32m${this.members}\x1b[0m members with \x1b[31m${this.memberErrors}\x1b[0m errors`
      );
      console.log(
        `\x1b[32m${this.feeds}\x1b[0m feeds with \x1b[31m${this.feedErrors}\x1b[0m errors`
      );
      console.log(
        `\x1b[32m${this.comments}\x1b[0m comments with \x1b[31m${this.commentErrors}\x1b[0m errors`
      );
      console.log("Total in database :");
      console.log(`\x1b[32m${dbState.groups}\x1b[0m groups`);
      console.log(`\x1b[32m${dbState.members}\x1b[0m members`);
      console.log(`\x1b[32m${dbState.feeds}\x1b[0m feeds`);
      console.log(`\x1b[32m${dbState.comments}\x1b[0m comments`);
      resolve();
    });
  }
}
