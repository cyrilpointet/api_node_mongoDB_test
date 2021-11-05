/* eslint-disable no-async-promise-executor */

import axios from "axios";
import { OgGroupManager } from "./OgGroupManager";

// const COMMENT_FIELDS = ["message", "from", "created_time"];
//
// const FEED_FIElDS = [
//   "from",
//   "type",
//   "story",
//   "message",
//   "full_picture",
//   "created_time",
//   "updated_time",
//   `comments.fields(${COMMENT_FIELDS.join()}).limit(10)`,
// ];
//
// const MEMBER_FIElDS = [
//   "email",
//   "name",
//   "department",
//   "primary_address",
//   "picture",
//   "account_claim_time",
//   "active",
// ];

const GROUP_FIELDS = [
  "name",
  "description",
  "created_time",
  "privacy",
  "archived",
  "updated_time",
  // `members.fields(${MEMBER_FIElDS.join()}).limit(500)`,
  // `feed.fields(${FEED_FIElDS.join()}).limit(10)`,
];

const GROUP_LIMIT = 500;

export class ApiCrawler {
  public static apiCallCount = 0;
  public static apiCallErrors = 0;
  public static start(): Promise<{
    apiCallCount: number;
    apiCallErrors: number;
  }> {
    this.apiCallCount = 0;
    this.apiCallErrors = 0;
    return new Promise(async (resolve, reject) => {
      // Construct Url
      const url = new URL(
        process.env.KERING_OG_ID + "/groups",
        process.env.OG_BASE_URL
      );
      url.searchParams.set("limit", GROUP_LIMIT.toString());
      url.searchParams.set("fields", GROUP_FIELDS.join());
      // Premier appel
      let ogResp;
      try {
        const { data } = await ApiCrawler.getDataFromApiUrl(url);
        ogResp = data;
      } catch (e) {
        console.log(e);
        reject(e);
        return;
      }
      try {
        await OgGroupManager.manageApiData(ogResp);
      } catch (e) {
        console.log(e);
        reject(e);
        return;
      }
      resolve({
        apiCallCount: this.apiCallCount,
        apiCallErrors: this.apiCallErrors,
      });
    });
  }

  public static getDataFromApiUrl(url: URL): Promise<any> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.KERING_APP_TOKEN,
    };
    return new Promise(async (resolve, reject) => {
      try {
        this.apiCallCount++;
        const resp = await axios.get(url.toString(), {
          headers,
        });
        resolve(resp);
      } catch (e) {
        this.apiCallErrors++;
        console.error(
          `\x1b[31mApi call failed with status ${e.response.status} \x1b[0m`
        );
        const limit = parseInt(url.searchParams.get("limit"));
        const newLimit = Math.floor(limit / 2);
        if (newLimit > 0) {
          url.searchParams.set("limit", newLimit.toString());
          console.error(`Retry with limit ${newLimit}`);
          const limitedResp = await this.getDataFromApiUrl(url);
          resolve(limitedResp);
        } else {
          reject(e);
        }
      }
    });
  }
}
