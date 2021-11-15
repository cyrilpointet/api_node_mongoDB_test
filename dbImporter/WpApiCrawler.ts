/* eslint-disable no-async-promise-executor */

import axios from "axios";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { WpGroupManager } from "./WpGroupManager";
import { CrawlerReporter } from "./CrawlerReporter";
import { User } from "../server/models/User";
import { seedAdmin } from "../seed/seedAdmin";
import { eventBus } from "./eventBus";

export class WpApiCrawler {
  private static pendingPromises = 0;
  private static resolve = null;

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
        await this.start();
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

  public static start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      eventBus.on("promisePendind", () => {
        this.pendingPromises++;
        CrawlerReporter.pendingPromises++;
      });
      eventBus.on("promiseResolved", () => {
        this.handlePromiseResolvedEvent();
      });

      try {
        WpGroupManager.importGroups();
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  private static handlePromiseResolvedEvent(): void {
    this.pendingPromises--;
    CrawlerReporter.pendingPromises--;
    if (1 > this.pendingPromises) {
      this.resolve();
    }
  }

  // On met un any pour accepter tous les types de réponses de l'api wp
  public static getDataFromApiUrl(url: URL): Promise<any> { // eslint-disable-line
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.KERING_APP_TOKEN,
    };
    return new Promise(async (resolve, reject) => {
      try {
        CrawlerReporter.apiCalls++;
        const resp = await axios.get(url.toString(), {
          headers,
        });
        resolve(resp);
        CrawlerReporter.printShortReport();
      } catch (e) {
        CrawlerReporter.apiErrors++;
        const limit = parseInt(url.searchParams.get("limit"));
        const newLimit = Math.floor(limit / 2);
        if (newLimit > 0) {
          url.searchParams.set("limit", newLimit.toString());
          const limitedResp = await this.getDataFromApiUrl(url);
          resolve(limitedResp);
        } else {
          reject(e);
          CrawlerReporter.printShortReport();
        }
      }
    });
  }
}
