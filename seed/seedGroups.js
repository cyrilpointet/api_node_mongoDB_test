import { Group } from "../server/models/Group";

export const seedGroups = async () => {
  await Group.deleteMany({});

  const gryffondor = new Group({
    name: "gryffondor",
    wpId: "temp",
  });
  gryffondor.wpId = gryffondor._id;
  await gryffondor.save();
  const serdaigle = new Group({
    name: "serdaigle",
    wpId: "temp",
  });
  serdaigle.wpId = serdaigle._id;
  await serdaigle.save();
  const poufsouffle = new Group({
    name: "poufsouffle",
    wpId: "temp",
  });
  poufsouffle.wpId = poufsouffle._id;
  await poufsouffle.save();
  const serpentard = new Group({
    name: "serpentard",
    wpId: "temp",
  });
  serpentard.wpId = serpentard._id;
  await serpentard.save();
};
