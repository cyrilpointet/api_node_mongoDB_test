import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/User";
import express from "express";

type userCtrlType = {
  signup: (req: express.Request, res: express.Response) => void;
  login: (req: express.Request, res: express.Response) => void;
};

export const userCtrl: userCtrlType = {
  signup(req: express.Request, res: express.Response): void {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hash,
        });
        user
          .save()
          .then((user) => res.status(201).json(user))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  },

  login(req: express.Request, res: express.Response): void {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user._id,
              token: jsonwebtoken.sign(
                { userId: user._id },
                "RANDOM_TOKEN_SECRET",
                { expiresIn: "24h" }
              ),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  },
};
