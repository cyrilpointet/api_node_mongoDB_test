/* eslint-disable no-async-promise-executor */

import { Group } from "../server/models/Group";
import { OgMemberManager } from "./OgMemberManager";
import { ApiCrawler } from "./ApiCrawler";
import { OgFeedManager } from "./OgFeedManager";
import { ogGroupRouteResponseType, ogGroupType } from "./ApiTypes";

const API_LIMIT = 50;

export class OgGroupManager {
  public static manageApiData(ogResp: ogGroupRouteResponseType): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const groups = ogResp.data;
      // Gestion des groupes
      for (let i = 0; i < groups.length; i++) {
        try {
          console.log(`Updating "${groups[i].name}"`);
          const updatedGroup = await OgGroupManager.upsertGroup(groups[i]);

          // Gestion des membres
          process.stdout.write("Members:");
          OgMemberManager.memberCount = 0;
          await OgMemberManager.manageApiData(
            groups[i].members
              ? groups[i].members
              : OgMemberManager.setOriginalQuery(groups[i].id),
            updatedGroup.id
          );
          console.log(" Done");

          // Gestion des feeds
          process.stdout.write("Feed and comments: ");
          await OgFeedManager.manageApiData(
            groups[i].feed
              ? groups[i].feed
              : OgFeedManager.setOriginalQuery(groups[i].id),
            updatedGroup.id
          );
          console.log("Done");

          console.log(
            `\x1b[32m"${groups[i].name}"\x1b[0m has been succesfully updated`
          );
        } catch {
          console.error(`Error with group "${groups[i].name}"`);
        }
      }

      if (ogResp.paging?.next) {
        try {
          const formatedUrl = new URL(ogResp.paging.next);
          formatedUrl.searchParams.set("limit", API_LIMIT.toString());
          const newResp = await ApiCrawler.getDataFromApiUrl(formatedUrl);
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
