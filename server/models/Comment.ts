import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
  wpId: { type: String, required: true, unique: true },
  message: { type: String, default: null },
  createdAt: { type: Date, required: true, default: new Date() },
  feed: {
    type: Schema.Types.ObjectId,
    ref: "Feed",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
});

// Virtuals -------------------------------------------
CommentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Setters -------------------------------------------
CommentSchema.set("toJSON", {
  virtuals: true,
});

//--------------------------------------------------

export const Comment = model("Comment", CommentSchema);
