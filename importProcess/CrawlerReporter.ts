import { createLogger, transports, format } from "winston";
import { Group } from "../server/models/Group";
import { Member } from "../server/models/Member";
import { Feed } from "../server/models/Feed";
import { Comment } from "../server/models/Comment";
import { AxiosError } from "axios";

type dbStateType = {
  groups: number;
  members: number;
  feeds: number;
  comments: number;
};

export class CrawlerReporter {
  public static apiCalls = 0;
  public static pendingApiCalls = 0;
  public static apiErrors = 0;
  public static groups = 0;
  public static members = 0;
  public static feeds = 0;
  public static comments = 0;
  public static unknownMembers = 0;
  public static groupErrors = 0;
  public static memberErrors = 0;
  public static feedErrors = 0;
  public static commentErrors = 0;

  public static logger = createLogger({
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      format.printf(
        (info) =>
          `${info.timestamp} ${info.level}: ${info.message}${
            info.durationMs ? " duration: " + info.durationMs / 1000 + " s" : ""
          }`
      )
    ),
    transports: [
      new transports.File({
        filename: `./logs/import/${
          new Date().toISOString().split("T")[0]
        }_import_logs.log`,
      }),
      new transports.File({
        filename: `./logs/import/${
          new Date().toISOString().split("T")[0]
        }_import_errors.log`,
        level: "warn",
      }),
      new transports.Console(),
    ],
  });

  public static addApiError(error: AxiosError): void {
    this.apiErrors++;
    if (error.response) {
      this.logger.error(
        `status ${error.response.status} - ${error.response.data.error.message}
        ${error.response.config.url}`
      );
    } else {
      this.logger.error(error);
    }
  }

  public static printShortReport(): void {
    process.stdout.write(
      `\rApi calls: \x1b[32m${this.apiCalls}\x1b[0m - \x1b[33m${this.pendingApiCalls}\x1b[0m - \x1b[31m${this.apiErrors}\x1b[0m, groups: \x1b[32m${this.groups}\x1b[0m - \x1b[31m${this.groupErrors}\x1b[0m, members: \x1b[32m${this.members}\x1b[0m - \x1b[31m${this.memberErrors}\x1b[0m, feeds: \x1b[32m${this.feeds}\x1b[0m - \x1b[31m${this.feedErrors}\x1b[0m, comments: \x1b[32m${this.comments}\x1b[0m - \x1b[31m${this.commentErrors}\x1b[0m`
    );
    return;
  }

  private static async getDbState(): Promise<dbStateType> {
    const groups = await Group.find({}).countDocuments();
    const members = await Member.find({}).countDocuments();
    const feeds = await Feed.find({}).countDocuments();
    const comments = await Comment.find({}).countDocuments();
    return {
      groups,
      members,
      feeds,
      comments,
    };
  }

  public static async printCompleteReport(): Promise<void> {
    const dbState = await this.getDbState();
    const report = `
    -------------------- Import Over --------------------
    Passed ${this.apiCalls} calls with ${this.apiErrors} errors
    
    Updated entries:
    ${this.groups} groups with ${this.groupErrors} errors
    ${this.members} members with ${this.memberErrors} errors and ${this.unknownMembers} unknown members
    ${this.feeds} feeds with ${this.feedErrors} errors
    ${this.comments} comments with ${this.commentErrors} errors
        
    Total in database :
    ${dbState.groups} groups
    ${dbState.members} members
    ${dbState.feeds} feeds
    ${dbState.comments} comments
    ------------------------------------------------------`;
    this.logger.info(report);
  }
}
