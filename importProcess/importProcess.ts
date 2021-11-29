import { WpApiCrawler } from "./WpApiCrawler";
import { CrawlerReporter } from "./CrawlerReporter";

const args = process.argv.slice(2);
const isQuickMode: boolean = args[0] === "quick";

WpApiCrawler.populateDb(isQuickMode)
  .then(async () => {
    CrawlerReporter.logger.info(`DB successfully updated`);
  })
  .catch(async (e) => {
    CrawlerReporter.logger.error(`Import stopped:
      ${e.message}`);
  });
