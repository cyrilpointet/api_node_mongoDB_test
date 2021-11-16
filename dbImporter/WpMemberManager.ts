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
  public static async importMembersByGroup(group: Group): Promise<void> {
    const url = new URL(group.wpId + "/members", process.env.OG_BASE_URL);
    url.searchParams.set("limit", MEMBER_LIMIT.toString());
    url.searchParams.set("fields", MEMBER_FIElDS.join());
    const { data } = await WpApiCrawler.getDataFromApiUrl(url);
    await this.manageApiData(data, group.id);
  }

  private static async manageApiData(
    ogResp: wpMemberRouteResponseType,
    groupId: string
  ): Promise<void> {
    for (let i = 0; i < ogResp.data.length; i++) {
      try {
        const member = await this.upsertMember(ogResp.data[i]);
        member.groups.push(groupId);
        await member.save();
        CrawlerReporter.members++;
      } catch (e) {
        CrawlerReporter.memberErrors++;
      }
      CrawlerReporter.printShortReport();
    }

    if (ogResp.paging?.next) {
      const formatedUrl = new URL(ogResp.paging.next);
      formatedUrl.searchParams.set("limit", MEMBER_LIMIT.toString());
      const newResp = await WpApiCrawler.getDataFromApiUrl(formatedUrl);
      await this.manageApiData(newResp.data, groupId);
    }
  }

  public static async importMemberFromId(id: string): Promise<Member> {
    const url = new URL(id, process.env.OG_BASE_URL);
    url.searchParams.set("fields", MEMBER_FIElDS.join());
    const { data } = await WpApiCrawler.getDataFromApiUrl(url);
    const member = await this.upsertMember(data);
    return member;
  }

  private static async upsertMember(rawMember: wpMemberType): Promise<Member> {
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
    const updatedMember = await Member.findOneAndUpdate(filter, updatedValues, {
      new: true,
      upsert: true,
    });
    return updatedMember;
  }
}
