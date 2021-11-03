/* eslint-disable no-async-promise-executor */

import axios from "axios";

export class ApiCrawler {
  public static getDataFromWpApi(url: URL): Promise<Record<string, any>> {
    return new Promise(async (resolve, reject) => {
      let ogResponse = null;
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.KERING_APP_TOKEN,
        };
        const { data } = await axios.get(url.toString(), { headers });
        ogResponse = data;
      } catch (e) {
        reject(e);
      }
      resolve(ogResponse);
    });
  }
}
