import { Schema, model } from "mongoose";

const FeedSchema = new Schema({
  ogId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  story: { type: String, default: null },
  message: { type: String, default: null },
  pictureLink: { type: String, default: null },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
});

// Virtuals -------------------------------------------
FeedSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Setters -------------------------------------------
FeedSchema.set("toJSON", {
  virtuals: true,
});

//--------------------------------------------------

export const Feed = model("Feed", FeedSchema);
