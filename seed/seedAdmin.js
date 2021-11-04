import { User } from "../server/models/User";
import bcryptjs from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const users = await User.find();
    for (let i = 0; i < users.length; i++) {
      users[i].remove();
    }
    const admins = await User.find({});
    if (1 > admins.length) {
      const hash = await bcryptjs.hash("admin", 10);
      const user = new User({
        email: "admin@admin.admin",
        password: hash,
        firstName: "admin",
        lastName: "admin",
      });
      await user.save();
    }
  } catch (e) {
    console.log(e);
  }
};
