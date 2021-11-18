import axios from "axios";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { WpGroupManager } from "./managers/WpGroupManager";
import { CrawlerReporter } from "./CrawlerReporter";
import { User } from "../server/models/User";
import { WpMemberManager } from "./managers/WpMemberManager";
import { WpFeedManager } from "./managers/WpFeedManager";

export class WpApiCrawler {
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

    // Si il n'y a pas d'admin en db, on en créer un par défaut
    const admins = await User.find();
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

    try {
      // Détache les membres existants des groupes pour ne pas conserver
      // de liaison vers des groupes qui n'existeraient plus
      await WpMemberManager.detachMembersFromGroups();

      // Détache les feeds et comments existants des groupes et membres pour ne pas conserver
      // de liaison vers des groupes ou membres qui n'existeraient plus
      await WpFeedManager.detachFeedsAndCommentsFromGroupsAndMembers();

      // Importe et update les groupes, et les membres et feeds et comments de chaque groupe
      await WpGroupManager.importGroups();

      // TODO => supprimer les orphelins ? (groupes sans membres, feed sans groupe,...)
    } finally {
      await CrawlerReporter.printCompleteReport();
      await mongoose.disconnect();
    }
    return;
  }

  // On met un any pour accepter tous les types de réponses de l'api wp
  public static async getDataFromApiUrl(url: URL): Promise<any> { // eslint-disable-line
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.KERING_APP_TOKEN,
    };
    try {
      CrawlerReporter.apiCalls++;
      CrawlerReporter.pendingApiCalls++;
      const resp = await axios.get(url.toString(), {
        headers,
        timeout: 30000,
      });
      CrawlerReporter.pendingApiCalls--;
      CrawlerReporter.printShortReport();
      return resp;
    } catch (e) {
      CrawlerReporter.pendingApiCalls--;
      CrawlerReporter.apiErrors++;
      if (!url.searchParams.get("limit")) {
        throw e;
      }
      // On ré-essaie avec une limite plus basse
      CrawlerReporter.apiErrors500++;
      const limit = parseInt(url.searchParams.get("limit"));
      const newLimit = Math.floor(limit / 2);
      if (newLimit > 0) {
        url.searchParams.set("limit", newLimit.toString());
        const limitedResp = await this.getDataFromApiUrl(url);
        return limitedResp;
      } else {
        CrawlerReporter.printShortReport();
        throw e;
      }
    }
  }
}
