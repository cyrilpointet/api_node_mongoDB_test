import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import axios from "axios";
import { User } from "../models/User";
import { Article } from "../models/Article";
import { Member } from "../models/Member";
import { Group } from "../models/Group";

mongoose.connect(process.env.URL_MONGO, {
  useNewUrlParser: true,
  dbName: process.env.DB_NAME,
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
  useUnifiedTopology: true,
});

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
  try {
    const users = await User.find();
    for (let i = 0; i < users.length; i++) {
      users[i].remove();
    }
    const admin = await User.findOne({ email: "admin@admin.admin" }).exec();
    if (null === admin) {
      const hash = await bcryptjs.hash("admin", 10);
      const user = new User({
        email: "admin@admin.admin",
        password: hash,
        firstName: "admin",
        lastName: "admin",
      });
      await user.save();
    }
  } catch (e) {
    console.log(e);
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
