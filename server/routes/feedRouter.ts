import express from "express";
import { auth } from "../middleware/auth";
import { feedsController } from "../controllers/feedsController";

const feedRouter = express.Router();

/**
 * @api {get} /feed Récupérer tous les feeds
 * @apiName GetFeeds
 * @apiGroup Feed
 *
 * @apiSuccess {Object[]} _ Liste des feeds
 * @apiSuccess {String} feed._id Id du feed
 * @apiSuccess {String} feed.story
 * @apiSuccess {String} feed.message
 * @apiSuccess {String} feed.id Id du feed (pour React Admin)
 * @apiSuccess {Date} feed.createdAt
 * @apiSuccess {Date} feed.updatedAt
 * @apiSuccess {String} feed.type
 * @apiSuccess {Object} feed.group groupe auquel est attache le feed
 * @apiSuccess {Object} feed.author member auteur du feed
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    [
 *      {
 *      "story": "string",
 *      "message": "string",
 *      "pictureLink": "string",
 *      "createdAt": "2021-10-29T10:50:11.368Z",
 *      "updatedAt": "2021-10-29T10:50:11.368Z",
 *      "_id": "617bd1e532cc53075433bd7b",
 *      "type": "type",
 *      "group": {
 *          "_id": "617bd1e332cc53075433bd08",
 *          "name": "gryffondor",
 *          "__v": 0,
 *          "id": "617bd1e332cc53075433bd08"
 *      },
 *      "author": {
 *          "department": null,
 *          "primaryAddress": null,
 *          "hasCustomPicture": false,
 *          "accountClaimTime": null,
 *          "active": false,
 *          "groups": [
 *              "617bd1e332cc53075433bd08"
 *          ],
 *          "_id": "617bd1e432cc53075433bd2e",
 *          "name": "Toto
 *          "email": "rd.hsyny@example.com",
 *          "pictureLink": "https://randomuser.me/api/portraits/thumb/men/49.jpg",
 *          "__v": 0,
 *          "id": "617bd1e432cc53075433bd2e"
 *      },
 *      "__v": 0,
 *      "id": "617bd1e532cc53075433bd7b",
 *      }
 *    ]
 */
feedRouter.get("/", auth, feedsController.getAllFeeds);

/**
 * @api {get} /feed Récupérer un feed par son Id
 * @apiName GetFeed
 * @apiGroup Feed
 *
 * @apiSuccess {String} _id Id du feed
 * @apiSuccess {String} story
 * @apiSuccess {String} message
 * @apiSuccess {String} id Id du feed (pour React Admin)
 * @apiSuccess {Date} createdAt
 * @apiSuccess {Date} updatedAt
 * @apiSuccess {String} type
 * @apiSuccess {Object} group groupe auquel est attache le feed
 * @apiSuccess {Object} author member auteur du feed
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     "story": "string",
 *     "message": "string",
 *     "pictureLink": "string",
 *     "createdAt": "2021-10-29T10:50:11.368Z",
 *     "updatedAt": "2021-10-29T10:50:11.368Z",
 *     "_id": "617bd1e532cc53075433bd7b",
 *     "type": "type",
 *     "group": {
 *         "_id": "617bd1e332cc53075433bd08",
 *         "name": "gryffondor",
 *         "__v": 0,
 *         "id": "617bd1e332cc53075433bd08"
 *     },
 *     "author": {
 *         "department": null,
 *         "primaryAddress": null,
 *         "hasCustomPicture": false,
 *         "accountClaimTime": null,
 *         "active": false,
 *         "groups": [
 *             "617bd1e332cc53075433bd08"
 *         ],
 *         "_id": "617bd1e432cc53075433bd2e",
 *         "name": "Toto
 *         "email": "rd.hsyny@example.com",
 *         "pictureLink": "https://randomuser.me/api/portraits/thumb/men/49.jpg",
 *         "__v": 0,
 *         "id": "617bd1e432cc53075433bd2e"
 *     },
 *     "__v": 0,
 *     "id": "617bd1e532cc53075433bd7b",
 *     }
 */
feedRouter.get("/:id", auth, feedsController.getFeedById);

export { feedRouter };
