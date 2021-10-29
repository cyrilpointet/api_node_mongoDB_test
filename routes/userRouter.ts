import express from "express";
import { userCtrl } from "../controllers/usersController";

const userRouter = express.Router();

/**
 * @api {post} /user/signup Créer un nouvel administrateur
 * @apiName RegisterUser
 * @apiGroup Administrateur
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {String} password password.
 * @apiParam {String} firstName User firstName.
 * @apiParam {String} lastName User lastName.
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
userRouter.post("/signup", userCtrl.signup);

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
userRouter.post("/login", userCtrl.login);

export { userRouter };
