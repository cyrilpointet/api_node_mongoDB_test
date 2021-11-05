/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Member } from "../server/models/Member";
import { ogMemberRouteResponseType, ogMemberType } from "./ApiTypes";

const API_LIMIT = 500;
const MEMBER_FIElDS = [
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
  public static manageApiData(
    ogResp: ogMemberRouteResponseType,
    groupId: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const members = ogResp.data;
      for (let i = 0; i < members.length; i++) {
        try {
          await this.upsertMember(members[i], groupId);
          this.memberCount++;
          process.stdout.write(
            `\rMembers: \x1b[34m${this.memberCount}\x1b[0m members updated`
          );
        } catch (e) {
          console.error(`invalid data member ${members[i].id}`);
        }
      }
      if (ogResp.paging?.next) {
        try {
          const formatedUrl = new URL(ogResp.paging.next);
          formatedUrl.searchParams.set("limit", API_LIMIT.toString());
          const newResp = await ApiCrawler.getDataFromApiUrl(formatedUrl);
          await this.manageApiData(newResp.data, groupId);
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }

  public static setOriginalQuery(groupId: string): ogMemberRouteResponseType {
    return {
      data: [],
      paging: {
        cursors: {
          before: "",
          after: "",
        },
        next: `${
          process.env.OG_BASE_URL
        }/${groupId}/members?limit=500&fields=${MEMBER_FIElDS.join()}`,
      },
    };
  }

  public static upsertMember(
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
