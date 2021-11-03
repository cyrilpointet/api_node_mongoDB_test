/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Group } from "../server/models/Group";
import { OgMemberManager } from "./OgMemberManager";

const GROUP_PARAMS = [
  "name",
  "description",
  "created_time",
  "privacy",
  "archived",
  "updated_time",
];

export class OgGroupManager {
  public static populateGroups(
    url: string,
    after: string | null = null
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let resp = null;
      try {
        resp = await ApiCrawler.getDataFromWpApi(url, 500, GROUP_PARAMS, after);
      } catch (e) {
        reject(e);
      }

      const groups = resp.data;
      for (let i = 0; i < groups.length; i++) {
        try {
          const updatedGroup = await this.upsertGroup(groups[i]);
          await OgMemberManager.populateGroupMembers(updatedGroup);
        } catch (e) {
          reject(e);
        }
      }

      if (resp.paging?.cursors?.after) {
        try {
          //await this.populateGroups(url, resp.paging.cursors.after);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }

  private static upsertGroup(rawGroup: Record<string, any>): Promise<Group> {
    return new Promise(async (resolve, reject) => {
      try {
        const filter = { ogId: rawGroup.id };
        const updatedValues = {
          name: rawGroup.name,
          description: rawGroup.description ? rawGroup.description : null,
          privacy: rawGroup.privacy,
          created_time: rawGroup.created_time,
          updated_time: rawGroup.updated_time,
          archived: rawGroup.archived,
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
        resolve(updatedGroup);
      } catch (e) {
        reject(e);
      }
    });
  }
}
