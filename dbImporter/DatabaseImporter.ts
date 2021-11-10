/* eslint-disable no-async-promise-executor */

import { WpApiCrawler } from "./WpApiCrawler";

WpApiCrawler.populateDb()
  .then(async () => {
    console.log(`\x1b[32m****** DB successfully updated ******\x1b[0m`);
  })
  .catch(async (e) => {
    console.error("\x1b[31mError: import stopped\x1b[0m");
    console.error(e.message);
  });
