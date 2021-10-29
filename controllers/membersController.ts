import express from "express";
import { Member } from "../models/Member";
import { Feed } from "../models/Feed";

type memberCtrlType = {
  getAllMembers: (req: express.Request, res: express.Response) => Promise<void>;
  updateMember: (req: express.Request, res: express.Response) => Promise<void>;
  getMemberById: (req: express.Request, res: express.Response) => void;
};

export const memberCtrl: memberCtrlType = {
  /**
   * @api {get} /member Récupérer tous les membres
   * @apiName GetMembers
   * @apiGroup Membre
   *
   * @apiSuccess {Object[]} member Liste des membres
   * @apiSuccess {Object[]} member.groups liste des groupes du membre.
   * @apiSuccess {Object[]} member.feeds liste des feeds du membre.
   * @apiSuccess {String} member._id Id du membre
   * @apiSuccess {String} member.name Nom du membre
   * @apiSuccess {String} member.email Email du membre
   * @apiSuccess {String} member.id Id du membre (pour React Admin)
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *    [
   *      {
   *        "groups": [
   *          {
   *            "_id": "6141bbf815733f2443c93c54",
   *            "name": "gryffondor",
   *            "__v": 0,
   *          }
   *        ]
   *        "_id": "6141bbf815733f2443c93c78",
   *        "name": "Harry 0",
   *        "email": "Harry_0@poudlard.com",
   *        "__v": 0,
   *        "id": "6141bbf815733f2443c93c78",
   *        "feeds": [
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
   *      }
   *    ]
   */
  async getAllMembers(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const totalMembers = await Member.find().exec();
      const totalLength = totalMembers.length;
      const members = await Member.find()
        .sort(
          req.query.sort
            ? { [req.query.sort as string]: req.query.order === "ASC" ? 1 : -1 }
            : {}
        )
        .limit(req.query.perPage ? parseInt(req.query.perPage as string) : 0)
        .skip(
          req.query.page && req.query.perPage
            ? (parseInt(req.query.page as string) - 1) *
                parseInt(req.query.perPage as string)
            : 0
        )
        .populate("groups")
        .populate({ path: "feeds", model: Feed })
        .exec();
      res.status(200).set("X-Total-Count", totalLength).json(members);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  /**
   * @api {get} /member/:id Récupérer un membre par son Id
   * @apiName GetMember
   * @apiGroup Membre
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
  getMemberById(req: express.Request, res: express.Response): void {
    Member.findOne({ _id: req.params.id })
      .populate("groups")
      .populate({ path: "feeds", model: Feed })
      .then((member) => res.status(200).json(member))
      .catch((error) => res.status(404).json({ error }));
  },

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
   *       "_id": "6141bbf815733f2443c93c78",
   *       "name": "Harry 0",
   *       "email": "Harry_0@poudlard.com",
   *       "__v": 0,
   *       "id": "6141bbf815733f2443c93c78"
   *     }
   */
  async updateMember(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).exec();
    res.status(200).json(updatedMember);
  },
};
