/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Group } from "../server/models/Group";
import { Member } from "../server/models/Member";
import { ogMemberType } from "./ApiTypes";

const MEMBERS_PARAMS = [
  "email",
  "name",
  "department",
  "primary_address",
  "picture",
  "account_claim_time",
  "active",
];

export class OgMemberManager {
  public static populateGroupMembers(group: Group): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // Supprime le groupe de la liste des groupes de tous les membres
      await Member.updateMany(
        { groups: { $in: [group._id] } },
        { $pull: { groups: group._id } }
      );

      try {
        await this.crawlGroupMembers(group._id, group.ogId + "/members");
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private static crawlGroupMembers(
    groupId: string,
    url: string,
    after: string | null = null
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let resp = null;
      process.stdout.write(".");
      try {
        resp = await ApiCrawler.getDataFromWpApi(
          url,
          500,
          MEMBERS_PARAMS,
          after
        );
      } catch (e) {
        reject(e);
        return;
      }

      const members = resp.data;
      for (let i = 0; i < members.length; i++) {
        try {
          await this.upsertMember(members[i], groupId);
        } catch (e) {
          reject(e);
        }
      }

      if (resp.paging.next) {
        try {
          await this.crawlGroupMembers(groupId, url, resp.paging.cursors.after);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        console.log(" done");
        resolve();
      }
    });
  }

  private static upsertMember(
    rawMember: ogMemberType,
    groupId: string
  ): Promise<Member> {
    return new Promise(async (resolve, reject) => {
      try {
        const filter = { ogId: rawMember.id };
        const updatedValues = {
          name: rawMember.name,
          email: rawMember.email ? rawMember.email : null,
          pictureLink: rawMember.picture.data.url,
          department: rawMember.department,
          primaryAddress: rawMember.primary_address,
          accountClaimTime: rawMember.account_claim_time
            ? rawMember.account_claim_time
            : null,
          active: rawMember.active,
          ogId: rawMember.id,
        };
        const updatedMember = await Member.findOneAndUpdate(
          filter,
          updatedValues,
          {
            new: true,
            upsert: true,
          }
        );
        updatedMember.groups.push(groupId);
        await updatedMember.save();
        resolve(updatedMember);
      } catch (e) {
        reject(e);
      }
    });
  }
}
