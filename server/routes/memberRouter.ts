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
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "groups": [
 *         {
 *           "_id": "6141bbf815733f2443c93c54",
 *           "name": "gryffondor",
 *           "__v": 0,
 *           }
 *         ],
 *       "_id": "6141bbf815733f2443c93c78",
 *       "name": "Harry 0",
 *       "email": "Harry_0@poudlard.com",
 *       "__v": 0,
 *       "id": "6141bbf815733f2443c93c78",
 *       "feeds": [
              {
                "story": null,
                "message": null,
                "pictureLink": null,
                "createdAt": "2021-10-29T10:50:11.368Z",
                "updatedAt": "2021-10-29T10:50:11.368Z",
                "_id": "617bd1e532cc53075433bd5b",
                "type": "coucou",
                "group": "617bd1e332cc53075433bd08",
                "author": "617bd1e432cc53075433bd2e",
                "__v": 0,
                "id": "617bd1e532cc53075433bd5b"
              }
            ]
 *     }
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
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "groups": [
 *         {
 *           "_id": "6141bbf815733f2443c93c54",
 *           "name": "gryffondor",
 *           "__v": 0,
 *         }
 *         ],
 *       "_id": "6141bbf815733f2443c93c78",
 *       "name": "Harry 0",
 *       "email": "Harry_0@poudlard.com",
 *       "__v": 0,
 *       "id": "6141bbf815733f2443c93c78"
 *     }
 */
memberRouter.get("/:id", auth, memberCtrl.getMemberById);

export { memberRouter };
