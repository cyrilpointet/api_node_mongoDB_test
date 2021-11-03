/* eslint-disable no-async-promise-executor */

import { QueryWithHelpers } from "mongoose";
import { ApiCrawler } from "./ApiCrawler";
import { Group } from "../server/models/Group";

export class OgGroupManager {
  public static populateGroups(url: URL): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let resp = null;
      try {
        resp = await ApiCrawler.getDataFromWpApi(url);
      } catch (e) {
        reject(e);
      }

      const groups = resp.data;
      let newGroupsCount = 0;
      let updatedGroupsCount = 0;
      for (let i = 0; i < groups.length; i++) {
        const updatedGroup = await this.upsertGroup(groups[i]);
        if (updatedGroup.lastErrorObject.updatedExisting) {
          updatedGroupsCount++;
        } else {
          newGroupsCount++;
        }
      }

      if (resp.paging.next) {
        console.log(
          `${updatedGroupsCount} groups updated, ${newGroupsCount} groups added, continue`
        );
        const nextUrl = new URL(resp.paging.next);
        try {
          await this.populateGroups(nextUrl);
          resolve();
        } catch (e) {
          console.log("error populateGroups retry");
          reject(e);
        }
      } else {
        console.log(
          `${updatedGroupsCount} groups updated, ${newGroupsCount} groups added, finished`
        );
        resolve();
      }
    });
  }

  private static upsertGroup(
    rawGroup: Record<string, any>
  ): Promise<QueryWithHelpers<any, any>> {
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
            rawResult: true,
          }
        );
        resolve(updatedGroup);
      } catch (e) {
        reject(e);
      }
    });
  }
}
