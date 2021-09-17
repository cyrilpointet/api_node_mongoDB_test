import mongoose from "mongoose";

const clientOptions = {
  useNewUrlParser: true,
  dbName: "apinode",
};

export const mongodb = {
  async initClientDbConnection(): Promise<void> {
    console.log(
      `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}`
    );
    try {
      await mongoose.connect(process.env.URL_MONGO, clientOptions);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
