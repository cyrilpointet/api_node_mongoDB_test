/* eslint-disable no-async-promise-executor */

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { seedAdmin } from "../seed/seedAdmin";
import { ApiCrawler } from "./ApiCrawler";
import { User } from "../server/models/User";

class DatabaseImporter {
  public static async populateDb(): Promise<void> {
    await mongoose.connect(process.env.URL_MONGO, {
      useNewUrlParser: true,
      dbName: process.env.DB_NAME,
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const admins = await User.find({});
    if (1 > admins.length) {
      const hash = await bcryptjs.hash("admin", 10);
      const user = new User({
        email: "admin@admin.admin",
        password: hash,
        firstName: "admin",
        lastName: "admin",
      });
      await user.save();
    }

    return new Promise(async (resolve, reject) => {
      try {
        // Créer un admin par defaut si il n'y en a aucun en base
        await seedAdmin();
        await ApiCrawler.start();
        await mongoose.disconnect();
        resolve();
      } catch (e) {
        await mongoose.disconnect();
        reject(e);
      }
    });
  }
}

DatabaseImporter.populateDb()
  .then(() => {
    console.log(
      `DB updated with \x1b[32m${ApiCrawler.apiCallCount} calls \x1b[0mand \x1b[31m${ApiCrawler.apiCallErrors} errors\x1b[0m`
    );
  })
  .catch((e) => {
    console.error("Import stopped");
    console.error(e.message);
  });
