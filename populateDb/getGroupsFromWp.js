import axios from "axios";
import { Member } from "../server/models/Member";

let totalCount = 0;

export const getMembersFromWp = async (
  url = `https://graph.facebook.com/307425489665885/members?limit=500&fields=primary_address,name,email,department,active,groups,picture`
) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Querying Work Place for groups");
      const { data: ogResponse } = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            "DQVJ2RS1mQ2V6U2lZAVTFNOUh1N2toZAFA0MDBqSTI1bXhyNFUwbXhLLWRMZAFM1WjF0OXp1dWxTb1BqWlVLUy1xOWVHVXhrd1ZAkd01GczBkSjB0ZA2duVGJ6RG1OM01iMXA3aEFNLWR0M2dUTG9QZAHZAMTVBKd09CdUVUSVpHYW84RTQ1eTRpbFlRd2hvTU1iR0tXQzA4eENEM0hDeHhXNVlKbXhEU09rMjNVaEROZAGp2V1MtRmJYemxJNVIwOXNjNS1sa2w5T3Bn",
        },
      });
      totalCount += ogResponse.data.length;
      console.log("Groups count: ", totalCount);

      // Creation des membres
      console.log(`Adding ${ogResponse.data.length} members`);
      for (let i = 0; i < ogResponse.data.length; i++) {
        const rawGroup = ogResponse.data[i];
        const member = new Member({
          name: rawGroup.name,
          email: rawGroup.email ? rawGroup.email : "Unknow",
          pictureLink: rawGroup.picture.data.url,
          department: rawGroup.department,
          primaryAddress: rawGroup.primary_address,
        });
        // rawGroup.groups.data.forEach((group) => {
        //   member.groups.push(group.id);
        // });
        await member.save();
      }
      console.log(`Done: added ${ogResponse.data.length} members`);

      if (ogResponse.paging.next) {
        getMembersFromWp(ogResponse.paging.next);
      } else {
        console.log(`Over: ${totalCount} members in db`);
        resolve();
      }
    } catch (e) {
      console.log(e.message);
      reject();
    }
  });
};
