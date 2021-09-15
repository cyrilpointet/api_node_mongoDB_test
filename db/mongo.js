import mongoose from "mongoose";

const clientOptions = {
  useNewUrlParser: true,
  dbName: "apinode",
};

export const mongodb = {
  async initClientDbConnection() {
    try {
      await mongoose.connect(process.env.URL_MONGO, clientOptions);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
