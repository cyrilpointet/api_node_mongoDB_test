/* eslint-disable no-async-promise-executor */

import { Group } from "../server/models/Group";
import { OgMemberManager } from "./OgMemberManager";
import { ApiCrawler } from "./ApiCrawler";
import { OgFeedManager } from "./OgFeedManager";
import { ogGroupType } from "./ApiTypes";

export class OgGroupManager {
  public static manageApiData(ogResp): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const groups = ogResp.data;
      // Gestion des groupes
      for (let i = 0; i < groups.length; i++) {
        try {
          console.log(`Updating "${groups[i].name}"`);
          const updatedGroup = await OgGroupManager.upsertGroup(groups[i]);

          // Gestion des membres
          if (groups[i].members) {
            process.stdout.write("Members: ");
            await OgMemberManager.manageApiData(
              groups[i].members,
              updatedGroup.id
            );
            console.log("Done");
          }
          // Gestion des feeds
          if (groups[i].feed) {
            process.stdout.write("Feed: ");
            await OgFeedManager.manageApiData(groups[i].feed, updatedGroup.id);
            console.log("Done");
          }
          console.log(`"${groups[i].name}" succesfully updated`);
        } catch {
          console.log(`Error with group "${groups[i].name}"`);
        }
      }

      if (ogResp.paging?.next) {
        try {
          const newResp = await ApiCrawler.getDataFromApiUrl(
            ogResp.paging.next
          );
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
  public static upsertGroup(rawGroup: ogGroupType): Promise<Group> {
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
        resolve(updatedGroup);
      } catch (e) {
        reject(e);
      }
    });
  }
}
