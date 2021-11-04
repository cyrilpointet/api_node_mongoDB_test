import express from "express";
import { auth } from "../middleware/auth";
import { memberCtrl } from "../controllers/membersController";

const memberRouter = express.Router();

/**
 * @api {get} /member Récupérer tous les membres
 * @apiName GetMembers
 * @apiGroup Membre
 *
 * @apiSuccess {Object[]} _ Liste des membres
 * @apiSuccess {Object[]} member.groups liste des groupes du membre.
 * @apiSuccess {Object[]} member.feeds liste des feeds du membre.
 * @apiSuccess {String} member._id Id du membre
 * @apiSuccess {String} member.name Nom du membre
 * @apiSuccess {String} member.email Email du membre
 * @apiSuccess {String} member.id Id du membre (pour React Admin)
 */
memberRouter.get("/", auth, memberCtrl.getAllMembers);

/**
 * @api {get} /member/:id Récupérer un membre par son Id
 * @apiName GetMember
 * @apiGroup Membre
 *
 * @apiSuccess {Object[]} group liste des groupes du membre.
 * @apiSuccess {String} _id Id du membre
 * @apiSuccess {String} name Nom du membre
 * @apiSuccess {String} email Email du membre
 * @apiSuccess {String} id Id du membre (pour React Admin)
 *
 */
memberRouter.put("/:id", auth, memberCtrl.updateMember);

/**
 * @api {put} /member/:id Update un membre par son Id
 * @apiName updateMember
 * @apiGroup Membre
 *
 * @apiQuery {Object}  Un objet member (voir model)
 *
 * @apiSuccess {Object[]} member.group liste des groupes du membre.
 * @apiSuccess {String} member._id Id du membre
 * @apiSuccess {String} member.name Nom du membre
 * @apiSuccess {String} member.email Email du membre
 * @apiSuccess {String} member.id Id du membre (pour React Admin)
 *
 */
memberRouter.get("/:id", auth, memberCtrl.getMemberById);

export { memberRouter };
