import { Schema, model } from "mongoose";

const MemberSchema = new Schema({
  wpId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, default: null },
  department: { type: String, default: null },
  primaryAddress: { type: String, default: null },
  hasCustomPicture: { type: Boolean, default: false },
  pictureLink: { type: String, required: true },
  accountClaimTime: { type: Date, default: null },
  active: { type: Boolean, required: true, default: true },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
});

// Virtuals -------------------------------------------
MemberSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

MemberSchema.virtual("feeds", {
  ref: "Feed",
  localField: "_id",
  foreignField: "author",
});

MemberSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "author",
});

// Setters -------------------------------------------
MemberSchema.set("toJSON", {
  virtuals: true,
});

export const Member = model("Member", MemberSchema);
