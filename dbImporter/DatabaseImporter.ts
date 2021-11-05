/* eslint-disable no-async-promise-executor */

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { seedAdmin } from "../seed/seedAdmin";
import { ApiCrawler, apiCrawlerReportType } from "./ApiCrawler";
import { User } from "../server/models/User";

class DatabaseImporter {
  public static async populateDb(): Promise<apiCrawlerReportType> {
    console.log(`
  _  __        _                _      _          _                     _           
 | |/ /___ _ _(_)_ _  __ _   __| |__ _| |_ __ _  (_)_ __  _ __  ___ _ _| |_ ___ _ _ 
 | ' </ -_) '_| | ' \\/ _\` | / _\` / _\` |  _/ _\` | | | '  \\| '_ \\/ _ \\ '_|  _/ -_) '_|
 |_|\\_\\___|_| |_|_||_\\__, | \\__,_\\__,_|\\__\\__,_| |_|_|_|_| .__/\\___/_|  \\__\\___|_|  
                     |___/                               |_|                        
`);
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
        const report = await ApiCrawler.start();
        await mongoose.disconnect();
        resolve(report);
      } catch (e) {
        await mongoose.disconnect();
        reject(e);
      }
    });
  }
}

DatabaseImporter.populateDb()
  .then((report) => {
    console.log(
      `DB updated with \x1b[32m${report.apiCallCount} api calls \x1b[0mand \x1b[31m${report.apiCallErrors} errors\x1b[0m`
    );
    console.log("Total in database :");
    console.log(`\x1b[34m${report.groupCount}\x1b[0m groups`);
    console.log(`\x1b[34m${report.memberCount}\x1b[0m members`);
    console.log(`\x1b[34m${report.feedCount}\x1b[0m feeds`);
    console.log(`\x1b[34m${report.commentCount}\x1b[0m comments`);
  })
  .catch((e) => {
    console.error("Import stopped");
    console.error(e.message);
  });
