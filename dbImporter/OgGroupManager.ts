/* eslint-disable no-async-promise-executor */

import { Group } from "../server/models/Group";
import { ApiCrawler } from "./ApiCrawler";
import { ogGroupRouteResponseType, ogGroupType } from "./ApiTypes";
import { OgMemberManager } from "./OgMemberManager";
import { OgFeedManager } from "./OgFeedManager";

const GROUP_FIELDS = [
  "name",
  "description",
  "created_time",
  "privacy",
  "archived",
  "updated_time",
];

const GROUP_LIMIT = 250;

export class OgGroupManager {
  public static groupCount = 0;
  public static groupError = 0;

  public static importGroups(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const url = new URL(
        process.env.KERING_OG_ID + "/groups",
        process.env.OG_BASE_URL
      );
      url.searchParams.set("limit", GROUP_LIMIT.toString());
      url.searchParams.set("fields", GROUP_FIELDS.join());
      try {
        const { data } = await ApiCrawler.getDataFromApiUrl(url);
        await this.manageApiData(data);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private static manageApiData(
    ogResp: ogGroupRouteResponseType
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.iterateEntries(ogResp.data);

      // TODO => maj condition pour crawl toute l'api
      if (ogResp.paging?.next && ogResp.paging === "toto") {
        try {
          const formatedUrl = new URL(ogResp.paging.next);
          formatedUrl.searchParams.set("limit", GROUP_LIMIT.toString());
          const newResp = await ApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiData(newResp.data);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        console.log(
          `\x1b[32m${this.groupCount}\x1b[0m groups updated with \x1b[31m${this.groupError}\x1b[0m errors.`
        );
        resolve();
      }
    });
  }

  private static iterateEntries(groups: ogGroupType[]): Promise<void> {
    return new Promise(async (resolve) => {
      for (let i = 0; i < groups.length; i++) {
        try {
          console.log(`Updating ${groups[i].name}`);
          await this.upsertGroup(groups[i]);
          this.groupCount++;
          console.log(
            `\x1b[32m${groups[i].name}\x1b[0m has been successfully updated`
          );
          console.log(`Total :  \x1b[32m${this.groupCount}\x1b[0m groups`);
        } catch (e) {
          this.groupError++;
        }
      }
      resolve();
    });
  }

  private static upsertGroup(rawGroup: ogGroupType): Promise<Group> {
    return new Promise(async (resolve, reject) => {
      try {
        const filter = { ogId: rawGroup.id };
        const updatedValues = {
          name: rawGroup.name,
          description: rawGroup.description ? rawGroup.description : null,
          privacy: rawGroup.privacy,
          createdAt: rawGroup.created_time,
          updatedAt: rawGroup.updated_time,
          active: !rawGroup.archived,
          ogId: rawGroup.id,
        };
        const updatedGroup = await Group.findOneAndUpdate(
          filter,
          updatedValues,
          {
            new: true,
            upsert: true,
          }
        );
        await OgMemberManager.importMembersByGroup(updatedGroup);
        await OgFeedManager.importFeedsByGroup(updatedGroup);
        resolve(updatedGroup);
      } catch (e) {
        reject(e);
      }
    });
  }
}
