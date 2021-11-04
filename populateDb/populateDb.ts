/* eslint-disable no-async-promise-executor */

import mongoose from "mongoose";
import { OgGroupManager } from "./OgGroupManager";

import { seedAdmin } from "../seed/seedAdmin";
import { Member } from "../server/models/Member";
import { Feed } from "../server/models/Feed";
import { Comment } from "../server/models/Comment";

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
      // Créer un admin par defaut si il n'y en a aucun en base
      await seedAdmin();
      // Supprime toutes les relations des membres
      await Member.updateMany({}, { groups: [] });
      // Supprime toutes les relations des feeds
      await Feed.updateMany({}, { group: null, author: null });
      // Supprime toutes les relations des comments
      await Comment.updateMany({}, { feed: null, author: null });

      // Lance le crawl des groupes
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
