/* eslint-disable no-async-promise-executor */

import axios from "axios";
import {
  ogFeedRouteResponseType,
  ogGroupRouteResponseType,
  ogMemberRouteResponseType,
} from "./ApiTypes";

export class ApiCrawler {
  public static getDataFromWpApi(
    url: string,
    limit: number,
    fields: string[],
    after?: string,
    since?: string,
    until?: string,
    pagingToken?: string
  ): Promise<
    | ogFeedRouteResponseType
    | ogGroupRouteResponseType
    | ogMemberRouteResponseType
  > {
    const constructedUrl = new URL(url, process.env.OG_BASE_URL);
    constructedUrl.searchParams.set("limit", limit.toString());
    constructedUrl.searchParams.set("fields", fields.join());
    if (after) {
      constructedUrl.searchParams.set("after", after);
    }
    if (since) {
      constructedUrl.searchParams.set("since", since);
    }
    if (until) {
      constructedUrl.searchParams.set("until", until);
    }
    if (pagingToken) {
      constructedUrl.searchParams.set("__paging_token", pagingToken);
    }
    return new Promise(async (resolve, reject) => {
      let ogResponse = null;
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.KERING_APP_TOKEN,
        };
        //console.log(`try ${limit} entries`);
        const { data } = await axios.get(constructedUrl.toString(), {
          headers,
        });
        ogResponse = data;
        //console.log(`Got ${ogResponse.data.length} entries`);
      } catch (e) {
        const newLimit = Math.floor(limit / 2);
        if (newLimit < 1) {
          reject(e);
          return;
        } else {
          const resp = await this.getDataFromWpApi(
            url,
            newLimit,
            fields,
            after
          );
          resolve(resp);
        }
      }
      resolve(ogResponse);
    });
  }
}
