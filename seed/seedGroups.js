import { Group } from "../server/models/Group";

export const seedGroups = async () => {
  const groups = await Group.find();
  for (let i = 0; i < groups.length; i++) {
    groups[i].remove();
  }
  const gryffondor = new Group({
    name: "gryffondor",
  });
  await gryffondor.save();
  const serdaigle = new Group({
    name: "serdaigle",
  });
  await serdaigle.save();
  const poufsouffle = new Group({
    name: "poufsouffle",
  });
  await poufsouffle.save();
  const serpentard = new Group({
    name: "serpentard",
  });
  await serpentard.save();
};
