import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
});

UserSchema.plugin(uniqueValidator);

// Virtuals -------------------------------------------
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Setters -------------------------------------------
UserSchema.set("toJSON", {
  virtuals: true,
});

export const User = model("User", UserSchema);
