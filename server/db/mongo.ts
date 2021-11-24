import mongoose from "mongoose";
import { logger } from "../utils/logger";

const clientOptions = {
  useNewUrlParser: true,
  dbName: process.env.DB_NAME,
};

export const mongodb = {
  async initClientDbConnection(): Promise<void> {
    console.log(
      `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}`
    );
    try {
      await mongoose.connect(process.env.URL_MONGO, clientOptions);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};
