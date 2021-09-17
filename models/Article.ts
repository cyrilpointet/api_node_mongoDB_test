import { Schema, model } from "mongoose";

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

ArticleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ArticleSchema.set("toJSON", {
  virtuals: true,
});

export const Article = model("Product", ArticleSchema);
