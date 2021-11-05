/* eslint-disable no-async-promise-executor */

import mongoose from "mongoose";
import { MagicCrawler } from "./MagicCrawler";
import { seedAdmin } from "../seed/seedAdmin";

mongoose.connect(process.env.URL_MONGO, {
  useNewUrlParser: true,
  dbName: process.env.DB_NAME,
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

async function populateDb(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // Créer un admin par defaut si il n'y en a aucun en base
      await seedAdmin();
      await MagicCrawler.crawl();
      resolve();
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

populateDb()
  .then(() => {
    console.log("DB updated");
    mongoose.disconnect();
  })
  .catch((e) => {
    console.log(e.message);
    mongoose.disconnect();
  });
