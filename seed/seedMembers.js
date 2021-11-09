import axios from "axios";
import { Member } from "../server/models/Member";
import { Group } from "../server/models/Group";

export const seedMembers = async () => {
  await Member.deleteMany({});

  const membersCount = 125;
  const newMembers = await axios.get(
    `https://randomuser.me/api/?results=${membersCount}`
  );
  const groups = await Group.find();

  for (let i = 0; i < newMembers.data.results.length; i++) {
    const member = new Member({
      wpId: "temp",
      name: `${newMembers.data.results[i].name.last} ${newMembers.data.results[i].name.first}`,
      email: newMembers.data.results[i].email,
      pictureLink: newMembers.data.results[i].picture.thumbnail,
      department: newMembers.data.results[i].location.city,
    });
    member.wpId = member._id;

    // Ajout des groupes
    let joinedGroups = [];
    for (let i = 0; i < Math.ceil(Math.random() * 4); i++) {
      const randomGroupIndex = Math.floor(Math.random() * 4);
      if (-1 === joinedGroups.indexOf(randomGroupIndex)) {
        member.groups.push(groups[randomGroupIndex]);
        joinedGroups.push(randomGroupIndex);
      }
    }
    await member.save();
  }
};
