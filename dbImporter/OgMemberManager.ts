/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Member } from "../server/models/Member";
import { ogMemberRouteResponseType, ogMemberType } from "./ApiTypes";
import { Group } from "../server/models/Group";

export const MEMBER_LIMIT = 500;
export const MEMBER_FIElDS = [
  "email",
  "name",
  "department",
  "primary_address",
  "picture",
  "account_claim_time",
  "active",
];

export class OgMemberManager {
  public static memberCount = 0;
  public static memberError = 0;

  public static importMembersByGroup(group: Group): Promise<void> {
    this.memberError = this.memberCount = 0;
    return new Promise(async (resolve, reject) => {
      const url = new URL(group.ogId + "/members", process.env.OG_BASE_URL);
      url.searchParams.set("limit", MEMBER_LIMIT.toString());
      url.searchParams.set("fields", MEMBER_FIElDS.join());
      try {
        const { data } = await ApiCrawler.getDataFromApiUrl(url);
        await this.manageApiResponse(data, group.id);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private static manageApiResponse(
    ogResp: ogMemberRouteResponseType,
    groupId: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.iterateEntries(ogResp.data, groupId);
      if (ogResp.paging?.next) {
        try {
          const formatedUrl = new URL(ogResp.paging.next);
          formatedUrl.searchParams.set("limit", MEMBER_LIMIT.toString());
          const newResp = await ApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiResponse(newResp.data, groupId);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        console.log(` with \x1b[31m${this.memberError}\x1b[0m errors`);
        resolve();
      }
    });
  }

  private static iterateEntries(
    members: ogMemberType[],
    groupId
  ): Promise<void> {
    return new Promise(async (resolve) => {
      for (let i = 0; i < members.length; i++) {
        try {
          const member = await this.upsertMember(members[i]);
          member.groups.push(groupId);
          await member.save();
          this.memberCount++;
          process.stdout.write(
            `\rMembers: \x1b[32m${this.memberCount}\x1b[0m members updated`
          );
        } catch (e) {
          this.memberError++;
        }
      }
      resolve();
    });
  }

  public static importMemberFromId(id: string): Promise<Member> {
    return new Promise(async (resolve, reject) => {
      const url = new URL(id, process.env.OG_BASE_URL);
      url.searchParams.set("fields", MEMBER_FIElDS.join());
      try {
        const { data } = await ApiCrawler.getDataFromApiUrl(url);
        const member = await this.upsertMember(data);
        resolve(member);
      } catch (e) {
        reject(e);
      }
    });
  }

  private static upsertMember(rawMember: ogMemberType): Promise<Member> {
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
        resolve(updatedMember);
      } catch (e) {
        reject(e);
      }
    });
  }
}
