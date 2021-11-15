/* eslint-disable no-async-promise-executor */

import { Group } from "../server/models/Group";
import { WpApiCrawler } from "./WpApiCrawler";
import { wpGroupRouteResponseType, wpGroupType } from "./wpApiTypes";
import { WpMemberManager } from "./WpMemberManager";
import { WpFeedManager } from "./WpFeedManager";
import { CrawlerReporter } from "./CrawlerReporter";

const GROUP_FIELDS = [
  "name",
  "description",
  "created_time",
  "privacy",
  "archived",
  "updated_time",
];

// TODO => maj à 500 pour crawl toute l'api
const GROUP_LIMIT = 10;

export class WpGroupManager {
  private static pendingRequests: Promise<void>[] = [];

  public static importGroups(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const url = new URL(
        process.env.KERING_OG_ID + "/groups",
        process.env.OG_BASE_URL
      );
      url.searchParams.set("limit", GROUP_LIMIT.toString());
      url.searchParams.set("fields", GROUP_FIELDS.join());
      try {
        const { data } = await WpApiCrawler.getDataFromApiUrl(url);
        await this.manageApiData(data);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private static manageApiData(
    ogResp: wpGroupRouteResponseType
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.iterateEntries(ogResp.data);

      // TODO => maj condition pour crawl toute l'api
      if (ogResp.paging?.next && ogResp.paging === "toto") {
        try {
          const formatedUrl = new URL(ogResp.paging.next);
          formatedUrl.searchParams.set("limit", GROUP_LIMIT.toString());
          const newResp = await WpApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiData(newResp.data);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }

  private static iterateEntries(groups: wpGroupType[]): Promise<void> {
    return new Promise(async (resolve) => {
      for (let i = 0; i < groups.length; i++) {
        try {
          await this.upsertGroup(groups[i]);
          CrawlerReporter.groups++;
        } catch (e) {
          CrawlerReporter.groupErrors++;
        }
        CrawlerReporter.printShortReport();
      }
      await Promise.all(this.pendingRequests);
      this.pendingRequests = [];
      resolve();
    });
  }

  private static upsertGroup(rawGroup: wpGroupType): Promise<Group> {
    return new Promise(async (resolve, reject) => {
      try {
        const filter = { wpId: rawGroup.id };
        const updatedValues = {
          name: rawGroup.name,
          description: rawGroup.description ? rawGroup.description : null,
          privacy: rawGroup.privacy,
          createdAt: rawGroup.created_time,
          updatedAt: rawGroup.updated_time,
          active: !rawGroup.archived,
          wpId: rawGroup.id,
        };
        const updatedGroup = await Group.findOneAndUpdate(
          filter,
          updatedValues,
          {
            new: true,
            upsert: true,
          }
        );
        this.pendingRequests.push(
          WpMemberManager.importMembersByGroup(updatedGroup)
        );
        this.pendingRequests.push(
          WpFeedManager.importFeedsByGroup(updatedGroup)
        );
        resolve(updatedGroup);
      } catch (e) {
        reject(e);
      }
    });
  }
}
