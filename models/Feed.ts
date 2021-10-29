import { Schema, model, QueryOptions } from "mongoose";

const FeedSchema = new Schema({
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

// Suppression des entrées dans les relations au delete ---------------
FeedSchema.pre("remove", function (next: QueryOptions) {
  this.model("Member").updateMany(
    { feeds: { $in: [this._id] } },
    { $pull: { feeds: this._id } },
    next
  );
});

FeedSchema.pre("remove", function (next: QueryOptions) {
  this.model("Group").updateMany(
    { feeds: { $in: [this._id] } },
    { $pull: { feeds: this._id } },
    next
  );
});
//--------------------------------------------------

export const Feed = model("Feed", FeedSchema);
