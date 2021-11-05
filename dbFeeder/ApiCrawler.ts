/* eslint-disable no-async-promise-executor */

import axios from "axios";

export class ApiCrawler {
  public static getDataFromApiUrl(url): Promise<any> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.KERING_APP_TOKEN,
    };
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await axios.get(url.toString(), {
          headers,
        });
        resolve(resp);
      } catch (e) {
        reject(e);
        return;
      }
    });
  }
}
