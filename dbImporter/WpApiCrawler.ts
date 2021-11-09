/* eslint-disable no-async-promise-executor */

import axios from "axios";
import { WpGroupManager } from "./WpGroupManager";
import { CrawlerReporter } from "./CrawlerReporter";

export class WpApiCrawler {
  public static start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await WpGroupManager.importGroups();
      } catch (e) {
        console.log(e);
        reject(e);
        return;
      }
      resolve();
    });
  }

  // On met un any pour accepter tous les types de réponses de l'api wp
  public static getDataFromApiUrl(url: URL): Promise<any> { // eslint-disable-line
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.KERING_APP_TOKEN,
    };
    return new Promise(async (resolve, reject) => {
      try {
        CrawlerReporter.apiCalls++;
        const resp = await axios.get(url.toString(), {
          headers,
        });
        resolve(resp);
      } catch (e) {
        CrawlerReporter.apiErrors++;
        console.error(
          `\x1b[31mApi call failed with status ${e.response?.status} \x1b[0m`
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
