import mongoose from "mongoose";

const ArticleSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

ArticleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ArticleSchema.set("toJSON", {
  virtuals: true,
});

export const Article = mongoose.model("Product", ArticleSchema);
