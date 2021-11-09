/* eslint-disable no-async-promise-executor */

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { seedAdmin } from "../seed/seedAdmin";
import { WpApiCrawler } from "./WpApiCrawler";
import { User } from "../server/models/User";
import { CrawlerReporter } from "./CrawlerReporter";

class DatabaseImporter {
  public static async populateDb(): Promise<void> {
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
        await WpApiCrawler.start();
        await CrawlerReporter.printCompleteReport();
        await mongoose.disconnect();
        resolve();
      } catch (e) {
        await CrawlerReporter.printCompleteReport();
        await mongoose.disconnect();
        reject(e);
      }
    });
  }
}

DatabaseImporter.populateDb()
  .then(async () => {
    console.log(`\x1b[32m****** DB updated successfully updated ******\x1b[0m`);
  })
  .catch(async (e) => {
    console.error("\x1b[31mError: import stopped\x1b[0m");
    console.error(e.message);
  });
