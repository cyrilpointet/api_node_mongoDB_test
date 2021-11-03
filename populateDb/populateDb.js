import { getMembersFromWp } from "./getMembersFromWp";
import mongoose from "mongoose";
import { seedAdmin } from "../seed/seedAdmin";

mongoose.connect(process.env.URL_MONGO, {
  useNewUrlParser: true,
  dbName: process.env.DB_NAME,
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
  useUnifiedTopology: true,
});

async function populateDb() {
  await seedAdmin();
  await getMembersFromWp();
  await mongoose.disconnect();
}

populateDb()
  .then(() => {
    console.log("DB updated");
  })
  .catch((e) => {
    console.log(e.message);
    mongoose.disconnect();
  });
