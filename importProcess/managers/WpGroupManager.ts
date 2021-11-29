import { Group } from "../../server/models/Group";
import { WpApiCrawler } from "../WpApiCrawler";
import { wpGroupRouteResponseType, wpGroupType } from "../wpApiTypes";
import { WpMemberManager } from "./WpMemberManager";
import { WpFeedManager } from "./WpFeedManager";
import { CrawlerReporter } from "../CrawlerReporter";

export type pendingPromisesType = {
  pendingMembers: Array<() => Promise<void>>;
  pendingFeeds: Array<() => Promise<void>>;
};

const GROUP_FIELDS = [
  "name",
  "description",
  "created_time",
  "privacy",
  "archived",
  "updated_time",
];

const GROUP_LIMIT = 200;
const QUICK_GROUP_LIMIT = 30;

export class WpGroupManager {
  private static isQuickMode = false;
  private static groupLimit = GROUP_LIMIT;
  private static pendingMembers: Array<() => Promise<void>> = [];
  private static pendingFeeds: Array<() => Promise<void>> = [];

  public static async importGroups(
    isQuickMode: boolean
  ): Promise<pendingPromisesType> {
    this.isQuickMode = isQuickMode;
    this.groupLimit = isQuickMode ? QUICK_GROUP_LIMIT : GROUP_LIMIT;
    const url = new URL(
      process.env.KERING_OG_ID + "/groups",
      process.env.OG_BASE_URL
    );
    url.searchParams.set("limit", this.groupLimit.toString());
    url.searchParams.set("fields", GROUP_FIELDS.join());
    const { data } = await WpApiCrawler.getDataFromApiUrl(url);
    await this.manageApiData(data);
    return {
      pendingMembers: this.pendingMembers,
      pendingFeeds: this.pendingFeeds,
    };
  }

  private static async manageApiData(
    ogResp: wpGroupRouteResponseType
  ): Promise<void> {
    for (let i = 0; i < ogResp.data.length; i++) {
      try {
        await this.upsertGroup(ogResp.data[i]);
        CrawlerReporter.groups++;
      } catch (e) {
        CrawlerReporter.groupErrors++;
      }
      CrawlerReporter.printShortReport();
    }

    if (ogResp.paging?.next && !this.isQuickMode) {
      const formatedUrl = new URL(ogResp.paging.next);
      formatedUrl.searchParams.set("limit", this.groupLimit.toString());
      const newResp = await WpApiCrawler.getDataFromApiUrl(formatedUrl);
      await this.manageApiData(newResp.data);
    } else {
      return;
    }
  }

  private static async upsertGroup(rawGroup: wpGroupType): Promise<void> {
    const filter = { wpId: rawGroup.id };
    const updatedValues = {
      name: rawGroup.name,
      description: rawGroup.description ? rawGroup.description : null,
      privacy: rawGroup.privacy,
      createdAt: rawGroup.created_time,
      updatedAt: rawGroup.updated_time,
      active: !rawGroup.archived,
      wpId: rawGroup.id,
    };
    const updatedGroup = await Group.findOneAndUpdate(filter, updatedValues, {
      new: true,
      upsert: true,
    });
    this.pendingMembers.push(() =>
      WpMemberManager.importMembersByGroup({
        id: updatedGroup._id,
        wpId: updatedGroup.wpId,
      })
    );
    this.pendingFeeds.push(() =>
      WpFeedManager.importFeedsByGroup({
        id: updatedGroup._id,
        wpId: updatedGroup.wpId,
      })
    );
    return;
  }
}
