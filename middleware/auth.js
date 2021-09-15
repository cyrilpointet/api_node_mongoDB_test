import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/User";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw "Invalid user ID";
    } else {
      req.loggedUser = user;
      next();
    }
  } catch (e) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
