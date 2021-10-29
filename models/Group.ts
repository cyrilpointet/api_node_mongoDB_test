import { Schema, model, QueryOptions } from "mongoose";

const GroupSchema = new Schema({
  name: { type: String, required: true },
});

// Virtuals -------------------------------------------
GroupSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

GroupSchema.virtual("members", {
  ref: "Member",
  localField: "_id",
  foreignField: "groups",
});

GroupSchema.virtual("feeds", {
  ref: "Feed",
  localField: "_id",
  foreignField: "group",
});

// Setters -------------------------------------------
GroupSchema.set("toJSON", {
  virtuals: true,
});

// Suppression des entrées dans les relations au delete ---------------
GroupSchema.pre("remove", function (next: QueryOptions) {
  this.model("Member").updateMany(
    { groups: { $in: [this._id] } },
    { $pull: { groups: this._id } },
    next
  );
});

export const Group = model("Group", GroupSchema);
