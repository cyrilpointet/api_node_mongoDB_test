import { Schema, model } from "mongoose";

const MemberSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
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
