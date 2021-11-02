import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/User";

export const auth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw "Invalid user ID";
    } else {
      // On ajoute la proprité loggedUser à l'objet req
      // et on place donc un ts-ignore uniquement pour les IDE
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.loggedUser = user;
      next();
    }
  } catch (e) {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
