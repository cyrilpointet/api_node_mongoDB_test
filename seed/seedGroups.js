import { Group } from "../server/models/Group";

export const seedGroups = async () => {
  await Group.deleteMany({});

  const gryffondor = new Group({
    name: "gryffondor",
    ogId: "temp",
  });
  gryffondor.ogId = gryffondor._id;
  await gryffondor.save();
  const serdaigle = new Group({
    name: "serdaigle",
    ogId: "temp",
  });
  serdaigle.ogId = serdaigle._id;
  await serdaigle.save();
  const poufsouffle = new Group({
    name: "poufsouffle",
    ogId: "temp",
  });
  poufsouffle.ogId = poufsouffle._id;
  await poufsouffle.save();
  const serpentard = new Group({
    name: "serpentard",
    ogId: "temp",
  });
  serpentard.ogId = serpentard._id;
  await serpentard.save();
};
