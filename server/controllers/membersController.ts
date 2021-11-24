import express from "express";
import { Member } from "../models/Member";
import { Feed } from "../models/Feed";
import { Comment } from "../models/Comment";
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
      ).estimatedDocumentCount();
      const members = await Member.find(QueryHelper.getQueryFilters(req))
        .sort(QueryHelper.getQuerySort(req))
        .limit(QueryHelper.getQueryLimit(req))
        .skip(QueryHelper.getQuerySkip(req))
        .populate("groups")
        .populate({ path: "feeds", model: Feed })
        .populate({ path: "comments", model: Comment })
        .exec();
      res.status(200).set("X-Total-Count", totalItemsCount).json(members);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getMemberById(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const member = await Member.findOne({ _id: req.params.id })
        .populate("groups")
        .populate({ path: "feeds", model: Feed })
        .populate({ path: "comments", model: Comment });
      res.status(200).json(member);
    } catch (e) {
      res.status(404).json({ e });
    }
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
