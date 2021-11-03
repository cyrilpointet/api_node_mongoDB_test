/* eslint-disable no-async-promise-executor */

import axios from "axios";

export class ApiCrawler {
  public static getDataFromWpApi(
    url: string,
    limit: number,
    fields: string[],
    after?: string
  ): Promise<Record<string, any>> {
    const constructedUrl = new URL(url, process.env.OG_BASE_URL);
    constructedUrl.searchParams.set("limit", limit.toString());
    constructedUrl.searchParams.set("fields", fields.join());
    if (after) {
      constructedUrl.searchParams.set("after", after);
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
        reject(e);
      }
      resolve(ogResponse);
    });
  }
}
