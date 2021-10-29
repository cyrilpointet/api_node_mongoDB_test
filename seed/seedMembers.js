import axios from "axios";
import { Member } from "../models/Member";
import { Group } from "../models/Group";

export const seedMembers = async () => {
  const members = await Member.find();
  for (let i = 0; i < members.length; i++) {
    members[i].remove();
  }

  let newMembers = await axios.get("https://randomuser.me/api/?results=5");
  const gryffondor = await Group.findOne({ name: "gryffondor" });
  for (let i = 0; i < 5; i++) {
    const member = new Member({
      name: `${newMembers.data.results[i].name.last} ${newMembers.data.results[i].name.first}`,
      email: newMembers.data.results[i].email,
      pictureLink: newMembers.data.results[i].picture.thumbnail,
    });
    member.groups.push(gryffondor._id);
    await member.save();
  }

  newMembers = await axios.get("https://randomuser.me/api/?results=5");
  const serpentard = await Group.findOne({ name: "serpentard" });
  for (let i = 0; i < 5; i++) {
    const member = new Member({
      name: `${newMembers.data.results[i].name.last} ${newMembers.data.results[i].name.first}`,
      email: newMembers.data.results[i].email,
      pictureLink: newMembers.data.results[i].picture.thumbnail,
    });
    member.groups.push(serpentard._id);
    await member.save();
  }

  newMembers = await axios.get("https://randomuser.me/api/?results=5");
  const poufsouffle = await Group.findOne({ name: "poufsouffle" });
  for (let i = 0; i < 5; i++) {
    const member = new Member({
      name: `${newMembers.data.results[i].name.last} ${newMembers.data.results[i].name.first}`,
      email: newMembers.data.results[i].email,
      pictureLink: newMembers.data.results[i].picture.thumbnail,
    });
    member.groups.push(poufsouffle._id);
    await member.save();
  }

  newMembers = await axios.get("https://randomuser.me/api/?results=5");
  const serdaigle = await Group.findOne({ name: "serdaigle" });
  for (let i = 0; i < 5; i++) {
    const member = new Member({
      name: `${newMembers.data.results[i].name.last} ${newMembers.data.results[i].name.first}`,
      email: newMembers.data.results[i].email,
      pictureLink: newMembers.data.results[i].picture.thumbnail,
    });
    member.groups.push(serdaigle._id);
    await member.save();
  }
};
