import express from "express";
import { Member } from "../models/Member";
import { Feed } from "../models/Feed";

type memberCtrlType = {
  getAllMembers: (req: express.Request, res: express.Response) => Promise<void>;
  updateMember: (req: express.Request, res: express.Response) => Promise<void>;
  getMemberById: (req: express.Request, res: express.Response) => void;
};

export const memberCtrl: memberCtrlType = {
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

  getMemberById(req: express.Request, res: express.Response): void {
    Member.findOne({ _id: req.params.id })
      .populate("groups")
      .populate({ path: "feeds", model: Feed })
      .then((member) => res.status(200).json(member))
      .catch((error) => res.status(404).json({ error }));
  },

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
