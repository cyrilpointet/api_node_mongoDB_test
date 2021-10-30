import express from "express";
import { Group } from "../models/Group";
import { Feed } from "../models/Feed";
import { QueryHelper } from "../services/QueryHelper";

type groupCtrlType = {
  getAllGroups: (req: express.Request, res: express.Response) => Promise<void>;
  getGroupById: (req: express.Request, res: express.Response) => void;
  updateGroup: (req: express.Request, res: express.Response) => Promise<void>;
  deleteGroup: (req: express.Request, res: express.Response) => Promise<void>;
};

export const groupCtrl: groupCtrlType = {
  async getAllGroups(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const totalItemsCount = await Group.find(
        QueryHelper.getQueryFilters(req)
      ).count();
      const groups = await Group.find(QueryHelper.getQueryFilters(req))
        .sort(QueryHelper.getQuerySort(req))
        .limit(QueryHelper.getQueryLimit(req))
        .skip(QueryHelper.getQuerySkip(req))
        .populate("members")
        .populate({ path: "feeds", model: Feed })
        .exec();
      res.status(200).set("X-Total-Count", totalItemsCount).json(groups);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getGroupById(req: express.Request, res: express.Response): void {
    Group.findOne({ _id: req.params.id })
      .populate("members")
      .populate({ path: "feeds", model: Feed })
      .then((group) => res.status(200).json(group))
      .catch((error) => res.status(404).json({ error }));
  },

  async deleteGroup(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const group = await Group.findOne({ _id: req.params.id });
      const resp = await group.remove();
      res.status(200).json(resp);
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  async updateGroup(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).exec();
    res.status(200).json(updatedGroup);
  },
};
