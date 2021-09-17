import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/User";
import express from "express";

type userCtrlType = {
  signup: (req: express.Request, res: express.Response) => void;
  login: (req: express.Request, res: express.Response) => void;
};

export const userCtrl: userCtrlType = {
  /**
   * @api {post} /user/signup Créer un nouvel administrateur
   * @apiName RegisterUser
   * @apiGroup Administrateur
   *
   * @apiParam {String} email Users unique email.
   * @apiParam {String} password password.
   *
   * @apiSuccess {String} userId User id.
   * @apiSuccess {String} token jwt.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "_id": "61420de7b8eadc08ab785a04",
   *        "email": "tota@toto.toto",
   *        "password": "$2a$10$1I5KLqUK4WXCMqp4CEDZr.U5lzoy6zx3yatM/VP48bhc7gPta/kb6",
   *        "__v": 0
   *    }
   */
  signup(req: express.Request, res: express.Response): void {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then((user) => res.status(201).json(user))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  },

  /**
   * @api {post} /user/login Login d'un administrateur
   * @apiName LogUser
   * @apiGroup Administrateur
   *
   * @apiParam {Number} id Users unique ID.
   *
   * @apiSuccess {String} userId User id.
   * @apiSuccess {String} token jwt.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "userId": "345678gi987",
   *       "token": "2VySWQiOiI2MTNiNTBkMTI3NTI3ZTAyYzA4MDYzNzAiLCJpYXQiOjE2MzE3MTgyMzQsImV4cCI6MTYzMTgwN"
   *     }
   */
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
