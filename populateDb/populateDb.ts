/* eslint-disable no-async-promise-executor */

import mongoose from "mongoose";
import { OgGroupManager } from "./OgGroupManager";

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
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      await seedAdmin();
      await OgGroupManager.populateGroups(process.env.KERING_OG_ID + "/groups");
      await mongoose.disconnect();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

populateDb()
  .then(() => {
    console.log("DB updated");
  })
  .catch((e) => {
    console.log(e.message);
    mongoose.disconnect();
  });
