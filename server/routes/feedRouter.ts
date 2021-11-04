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
 */
feedRouter.get("/:id", auth, feedsController.getFeedById);

export { feedRouter };
