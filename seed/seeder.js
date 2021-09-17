import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { User } from "../models/User";
import { Article } from "../models/Article";
import { Member } from "../models/Member";
import { Group } from "../models/Group";

mongoose.connect(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}`,
  {
    useNewUrlParser: true,
    dbName: process.env.DB_NAME,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    useUnifiedTopology: true,
  }
);

async function seedArticles() {
  const articles = await Article.find();
  if (1 > articles.length) {
    for (let i = 0; i < 20; i++) {
      const product = new Article({
        title: `Article ${i}`,
        content: `Description ${i}`,
      });
      await product.save();
    }
  }
}

async function seedMembers() {
  const members = await Member.find();
  for (let i = 0; i < members.length; i++) {
    members[i].remove();
  }
  const gryffondor = await Group.findOne({ name: "gryffondor" });
  for (let i = 0; i < 5; i++) {
    const member = new Member({
      name: `Harry ${i}`,
      email: `Harry_${i}@poudlard.com`,
    });
    member.groups.push(gryffondor._id);
    await member.save();
  }

  const serpentard = await Group.findOne({ name: "serpentard" });
  for (let i = 0; i < 5; i++) {
    const member = new Member({
      name: `Draco ${i}`,
      email: `Draco_${i}@poudlard.com`,
    });
    member.groups.push(serpentard._id);
    await member.save();
  }

  const poufsouffle = await Group.findOne({ name: "poufsouffle" });
  for (let i = 0; i < 5; i++) {
    const member = new Member({
      name: `Norbert ${i}`,
      email: `Norbert_${i}@poudlard.com`,
    });
    member.groups.push(poufsouffle._id);
    await member.save();
  }

  const serdaigle = await Group.findOne({ name: "serdaigle" });
  for (let i = 0; i < 5; i++) {
    const member = new Member({
      name: `Luna ${i}`,
      email: `Luna_${i}@poudlard.com`,
    });
    member.groups.push(serdaigle._id);
    await member.save();
  }
}

async function seedGroups() {
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
}

async function seedAdmin() {
  const admin = await User.findOne({ email: "admin@admin.admin" }).exec();
  if (null === admin) {
    const hash = await bcryptjs.hash("admin", 10);
    const user = new User({
      email: "admin@admin.admin",
      password: hash,
    });
    await user.save();
  }
  await seedArticles();
  await seedGroups();
  await seedMembers();
  await mongoose.disconnect();
}

seedAdmin()
  .then(() => {
    console.log("DB seeded");
  })
  .catch((e) => {
    console.log(e.message);
  });
