import express from "express";
import { auth } from "../middleware/auth";
import { commentsController } from "../controllers/commentsController";

const commentRouter = express.Router();

/**
 * @api {get} /comment Récupérer tous les comments
 * @apiName GetComments
 * @apiGroup Comment
 *
 * @apiSuccess {Object[]} _ Liste des comments
 * @apiSuccess {String} comment._id Id du comment
 * @apiSuccess {String} comment.message
 * @apiSuccess {String} comment.id Id du comment (pour React Admin)
 * @apiSuccess {Date} comment.createdAt
 * @apiSuccess {Object} comment.feed groupe auquel est attache le comment
 * @apiSuccess {Object} comment.author member auteur du comment
 *
 */
commentRouter.get("/", auth, commentsController.getAllComments);

/**
 * @api {get} /comment Récupérer un comment par son Id
 * @apiName GetComment
 * @apiGroup Comment
 *
 * @apiSuccess {String} _id Id du comment
 * @apiSuccess {String} story
 * @apiSuccess {String} message
 * @apiSuccess {String} id Id du comment (pour React Admin)
 * @apiSuccess {Date} createdAt
 * @apiSuccess {Date} updatedAt
 * @apiSuccess {String} type
 * @apiSuccess {Object} group groupe auquel est attache le comment
 * @apiSuccess {Object} author member auteur du comment
 *
 */
commentRouter.get("/:id", auth, commentsController.getCommentById);

export { commentRouter };
