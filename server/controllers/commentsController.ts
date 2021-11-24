import express from "express";
import { Comment } from "../models/Comment";
import { QueryHelper } from "../services/QueryHelper";

type feedsCtrlType = {
  getAllComments: (
    req: express.Request,
    res: express.Response
  ) => Promise<void>;
  getCommentById: (req: express.Request, res: express.Response) => void;
};

export const commentsController: feedsCtrlType = {
  async getAllComments(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const totalItemsCount = await Comment.find(
        QueryHelper.getQueryFilters(req)
      ).estimatedDocumentCount();
      const comments = await Comment.find(QueryHelper.getQueryFilters(req))
        .sort(QueryHelper.getQuerySort(req))
        .limit(QueryHelper.getQueryLimit(req))
        .skip(QueryHelper.getQuerySkip(req))
        .populate("author")
        .populate("feed")
        .exec();
      res.status(200).set("X-Total-Count", totalItemsCount).json(comments);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getCommentById(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const comment = await Comment.findOne({ _id: req.params.id })
        .populate("author")
        .populate("feed");
      res.status(200).json(comment);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  },
};
