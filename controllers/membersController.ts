import express from "express";
import { Member } from "../models/Member";
import { Feed } from "../models/Feed";
import { QueryHelper } from "../services/QueryHelper";

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
      const totalItemsCount = await Member.find(
        QueryHelper.getQueryFilters(req)
      ).count();
      const members = await Member.find(QueryHelper.getQueryFilters(req))
        .sort(QueryHelper.getQuerySort(req))
        .limit(QueryHelper.getQueryLimit(req))
        .skip(QueryHelper.getQuerySkip(req))
        .populate("groups")
        .populate({ path: "feeds", model: Feed })
        .exec();
      res.status(200).set("X-Total-Count", totalItemsCount).json(members);
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
