/* eslint-disable no-async-promise-executor */

import { Group } from "../server/models/Group";
import { WpApiCrawler } from "./WpApiCrawler";
import { wpGroupRouteResponseType, wpGroupType } from "./wpApiTypes";
import { WpMemberManager } from "./WpMemberManager";
import { WpFeedManager } from "./WpFeedManager";
import { CrawlerReporter } from "./CrawlerReporter";
import { eventBus } from "./eventBus";

const GROUP_FIELDS = [
  "name",
  "description",
  "created_time",
  "privacy",
  "archived",
  "updated_time",
];

const GROUP_LIMIT = 500;

export class WpGroupManager {
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

      if (ogResp.paging?.next) {
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
        eventBus.emit("promisePendind");
        WpMemberManager.importMembersByGroup(updatedGroup)
          .then(() => {
            eventBus.emit("promiseResolved");
          })
          .catch(() => {
            eventBus.emit("promiseResolved");
          });
        eventBus.emit("promisePendind");
        WpFeedManager.importFeedsByGroup(updatedGroup)
          .then(() => {
            eventBus.emit("promiseResolved");
          })
          .catch(() => {
            eventBus.emit("promiseResolved");
          });
        resolve(updatedGroup);
      } catch (e) {
        reject(e);
      }
    });
  }
}
