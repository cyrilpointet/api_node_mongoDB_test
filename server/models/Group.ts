import { Schema, model, QueryOptions } from "mongoose";

const GroupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: null },
  privacy: { type: String, required: true, default: "CLOSED" },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
  active: { type: Boolean, required: true, default: true },
  ogId: { type: String, required: true, unique: true },
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
  this.model("Feed").updateMany(
    { group: this._id },
    { $pull: { group: this._id } },
    next
  );
});

export const Group = model("Group", GroupSchema);
