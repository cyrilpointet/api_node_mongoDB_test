import { WpApiCrawler } from "../WpApiCrawler";
import { Member } from "../../server/models/Member";
import {
  entityIdsType,
  wpMemberRouteResponseType,
  wpMemberType,
} from "../wpApiTypes";
import { CrawlerReporter } from "../CrawlerReporter";

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
  // Détache les membres existants des groupes pour ne pas conserver
  // de liaison vers des groupes qui n'existeraient plus
  public static async detachMembersFromGroups(): Promise<void> {
    await Member.updateMany({}, { groups: [] });
    return;
  }

  public static async importMembersByGroup(
    group: entityIdsType
  ): Promise<void> {
    const url = new URL(group.wpId + "/members", process.env.OG_BASE_URL);
    url.searchParams.set("limit", MEMBER_LIMIT.toString());
    url.searchParams.set("fields", MEMBER_FIElDS.join());
    const { data } = await WpApiCrawler.getDataFromApiUrl(url);
    await this.manageApiData(data, group.id);
    return;
  }

  private static async manageApiData(
    ogResp: wpMemberRouteResponseType,
    groupId: string
  ): Promise<void> {
    for (let i = 0; i < ogResp.data.length; i++) {
      try {
        await this.upsertMember(ogResp.data[i], groupId);
        CrawlerReporter.members++;
      } catch (e) {
        CrawlerReporter.memberErrors++;
      }
    }
    CrawlerReporter.printShortReport();

    if (ogResp.paging?.next) {
      const formatedUrl = new URL(ogResp.paging.next);
      formatedUrl.searchParams.set("limit", MEMBER_LIMIT.toString());
      const newResp = await WpApiCrawler.getDataFromApiUrl(formatedUrl);
      await this.manageApiData(newResp.data, groupId);
    }
  }

  public static async getOrImportMemberIdFromWpId(
    wpId: string
  ): Promise<string | null> {
    let memberId: string | null = null;
    const member = await Member.findOne({ wpId });

    // Si le membre est inconnu, on essaie de l'importer
    if (!member) {
      const url = new URL(wpId, process.env.OG_BASE_URL);
      url.searchParams.set("fields", MEMBER_FIElDS.join());
      try {
        const { data } = await WpApiCrawler.getDataFromApiUrl(url);
        const memberIds = await this.upsertMember(data);
        memberId = memberIds.id;
        CrawlerReporter.members++;
      } catch {
        CrawlerReporter.memberErrors++;
      }
    } else {
      memberId = member._id;
    }
    return memberId;
  }

  private static async upsertMember(
    rawMember: wpMemberType,
    groupId: string | null = null
  ): Promise<entityIdsType> {
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
    if (groupId) {
      updatedMember.groups.push(groupId);
      await updatedMember.save();
    }
    return { id: updatedMember._id, wpId: updatedMember.wpId };
  }
}
