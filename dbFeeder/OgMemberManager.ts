/* eslint-disable no-async-promise-executor */

import { ApiCrawler } from "./ApiCrawler";
import { Member } from "../server/models/Member";
import { ogMemberType } from "./ApiTypes";

export class OgMemberManager {
  public static manageApiData(ogResp, groupId): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const members = ogResp.data;
      for (let i = 0; i < members.length; i++) {
        process.stdout.write(".");
        try {
          await this.upsertMember(members[i], groupId);
        } catch (e) {
          console.error(`invalid data member ${members[i].id}`);
        }
      }
      if (ogResp.paging?.next) {
        try {
          const newResp = await ApiCrawler.getDataFromApiUrl(
            ogResp.paging.next
          );
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
