/* eslint-disable no-async-promise-executor */

import mongoose from "mongoose";
import { OgGroupManager } from "./OgGroupManager";
// import axios from "axios";
// import { getMembersFromWp } from "./getMembersFromWp";
// import { seedAdmin } from "../seed/seedAdmin";

mongoose.connect(process.env.URL_MONGO, {
  useNewUrlParser: true,
  dbName: process.env.DB_NAME,
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
  useUnifiedTopology: true,
});

const GROUP_PARAMS = [
  "name",
  "description",
  "created_time",
  "privacy",
  "archived",
  "updated_time",
];

async function populateDb(): Promise<void> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = new URL(
      process.env.KERING_OG_ID + "/groups",
      process.env.OG_BASE_URL
    );
    url.searchParams.set("limit", "500");
    url.searchParams.set("fields", GROUP_PARAMS.join());
    try {
      await OgGroupManager.populateGroups(url);
      // await seedAdmin();
      // await getMembersFromWp();
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
