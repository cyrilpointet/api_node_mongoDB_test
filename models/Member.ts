import { Schema, model } from "mongoose";

const MemberSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, default: null },
  primaryAddress: { type: String, default: null },
  hasCustomPicture: { type: Boolean, default: false },
  pictureLink: { type: String, required: true },
  //accountClaimTime: { type: Date, required: true },
  accountClaimTime: { type: Date, default: null }, // todo => voir cette valeur
  active: { type: Boolean, default: false },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
});

MemberSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

MemberSchema.set("toJSON", {
  virtuals: true,
});

export const Member = model("Member", MemberSchema);
