/* eslint-disable no-async-promise-executor */

import { WpApiCrawler } from "./WpApiCrawler";
import { Member } from "../server/models/Member";
import { wpMemberRouteResponseType, wpMemberType } from "./wpApiTypes";
import { Group } from "../server/models/Group";
import { CrawlerReporter } from "./CrawlerReporter";

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

export class WpMemberManager {
  public static importMembersByGroup(group: Group): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const url = new URL(group.wpId + "/members", process.env.OG_BASE_URL);
      url.searchParams.set("limit", MEMBER_LIMIT.toString());
      url.searchParams.set("fields", MEMBER_FIElDS.join());
      try {
        const { data } = await WpApiCrawler.getDataFromApiUrl(url);
        await this.manageApiResponse(data, group.id);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private static manageApiResponse(
    ogResp: wpMemberRouteResponseType,
    groupId: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.iterateEntries(ogResp.data, groupId);
      if (ogResp.paging?.next) {
        try {
          const formatedUrl = new URL(ogResp.paging.next);
          formatedUrl.searchParams.set("limit", MEMBER_LIMIT.toString());
          const newResp = await WpApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiResponse(newResp.data, groupId);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }

  private static iterateEntries(
    members: wpMemberType[],
    groupId
  ): Promise<void> {
    return new Promise(async (resolve) => {
      for (let i = 0; i < members.length; i++) {
        try {
          const member = await this.upsertMember(members[i]);
          member.groups.push(groupId);
          await member.save();
          CrawlerReporter.members++;
        } catch (e) {
          CrawlerReporter.memberErrors++;
        }
        CrawlerReporter.printShortReport();
      }
      resolve();
    });
  }

  public static importMemberFromId(id: string): Promise<Member> {
    return new Promise(async (resolve, reject) => {
      const url = new URL(id, process.env.OG_BASE_URL);
      url.searchParams.set("fields", MEMBER_FIElDS.join());
      try {
        const { data } = await WpApiCrawler.getDataFromApiUrl(url);
        const member = await this.upsertMember(data);
        resolve(member);
      } catch (e) {
        reject(e);
      }
    });
  }

  private static upsertMember(rawMember: wpMemberType): Promise<Member> {
    return new Promise(async (resolve, reject) => {
      try {
        const filter = { wpId: rawMember.id };
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
          wpId: rawMember.id,
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
