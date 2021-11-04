import express from "express";
import { userCtrl } from "../controllers/usersController";
import { auth } from "../middleware/auth";

const userRouter = express.Router();

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
 */
userRouter.post("/login", userCtrl.login);

/**
 * @api {get} /user Récupérer la liste de tous les administrateurs
 * @apiName GetUsers
 * @apiGroup Administrateur
 *
 * @apiSuccess {Object[]} _ Liste des administrateurs
 * @apiSuccess {String} user._id Users unique id.
 * @apiSuccess {String} user.email Users unique email.
 * @apiSuccess {String} user.password password.
 * @apiSuccess {String} user.firstName User firstName.
 * @apiSuccess {String} user.lastName User lastName.
 *
 */
userRouter.get("/", auth, userCtrl.getAllUsers);

/**
 * @api {get} /user Récupérer un administrateur par son id
 * @apiName GetUser
 * @apiGroup Administrateur
 *
 * @apiSuccess {String} _id Users unique id.
 * @apiSuccess {String} email Users unique email.
 * @apiSuccess {String} password password.
 * @apiSuccess {String} firstName User firstName.
 * @apiSuccess {String} lastName User lastName.
 *
 */
userRouter.get("/:id", auth, userCtrl.getUserById);

/**
 * @api {post} /user Créer un nouvel administrateur
 * @apiName RegisterUser
 * @apiGroup Administrateur
 *
 * @apiSuccess {String} email Users unique email.
 * @apiSuccess {String} password password.
 * @apiSuccess {String} firstName User firstName.
 * @apiSuccess {String} lastName User lastName.
 *
 */
userRouter.post("/", auth, userCtrl.create);

export { userRouter };
