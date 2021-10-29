import mongoose from "mongoose";
import { Article } from "../models/Article";
import { seedFeeds } from "./seedFeeds";
import { seedMembers } from "./seedMembers";
import { seedAdmin } from "./seedAdmin";
import { seedGroups } from "./seedGroups";

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

async function seed() {
  await seedAdmin();
  await seedArticles();
  await seedGroups();
  await seedMembers();
  await seedFeeds();
  await mongoose.disconnect();
}

seed()
  .then(() => {
    console.log("DB seeded");
  })
  .catch((e) => {
    console.log(e.message);
  });
