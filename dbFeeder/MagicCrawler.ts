/* eslint-disable no-async-promise-executor */

import axios from "axios";
import { OgGroupManager } from "./OgGroupManager";
import { OgMemberManager } from "./OgMemberManager";
import { ApiCrawler } from "./ApiCrawler";

const FIELDS =
  "description,name,privacy,created_time,updated_time,archived,members.limit(500).fields(primary_address,name,email,department,active,picture,account_claim_time),feed.limit(500).fields(from,type,story,message,full_picture,created_time,updated_time,comments.limit(500).fields(message,from,created_time))";

export class MagicCrawler {
  public static crawl(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Construct Url
      const url = new URL(
        process.env.KERING_OG_ID + "/groups",
        process.env.OG_BASE_URL
      );
      url.searchParams.set("limit", "20");
      url.searchParams.set("fields", FIELDS);
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

      resolve();
    });
  }
}
