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
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    [
 *      {
 *      "message": "string",
 *      "createdAt": "2021-10-29T10:50:11.368Z",
 *      "_id": "617bd1e532cc53075433bd7b",
 *      "feed": {
 *          TODO
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
 *     "feed": {
 *         TODO
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
commentRouter.get("/:id", auth, commentsController.getCommentById);

export { commentRouter };
