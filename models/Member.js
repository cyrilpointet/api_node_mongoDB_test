import mongoose from "mongoose";

const MemberSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
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

export const Member = mongoose.model("Member", MemberSchema);
