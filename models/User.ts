import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.plugin(uniqueValidator);

export const User = model("User", UserSchema);
