import axios from "axios";
import { Member } from "../models/Member";
import { Group } from "../models/Group";

export const seedMembers = async () => {
  const members = await Member.find();
  for (let i = 0; i < members.length; i++) {
    members[i].remove();
  }

  const newMembers = await axios.get("https://randomuser.me/api/?results=750");
  const groups = await Group.find();

  for (let i = 0; i < newMembers.data.results.length; i++) {
    const member = new Member({
      name: `${newMembers.data.results[i].name.last} ${newMembers.data.results[i].name.first}`,
      email: newMembers.data.results[i].email,
      pictureLink: newMembers.data.results[i].picture.thumbnail,
      department: newMembers.data.results[i].location.city,
    });
    const randomGroupNumber = Math.floor(Math.random() * 4);
    member.groups.push(groups[randomGroupNumber]._id);
    await member.save();
  }
};
