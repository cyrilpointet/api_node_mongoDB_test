import express from "express";
import { Feed } from "../models/Feed";
import { Comment } from "../models/Comment";
import { QueryHelper } from "../services/QueryHelper";

type feedsCtrlType = {
  getAllFeeds: (req: express.Request, res: express.Response) => Promise<void>;
  getFeedById: (req: express.Request, res: express.Response) => void;
};

export const feedsController: feedsCtrlType = {
  async getAllFeeds(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const totalItemsCount = await Feed.find(
        QueryHelper.getQueryFilters(req)
      ).estimatedDocumentCount();
      const feeds = await Feed.find(QueryHelper.getQueryFilters(req))
        .sort(QueryHelper.getQuerySort(req))
        .limit(QueryHelper.getQueryLimit(req))
        .skip(QueryHelper.getQuerySkip(req))
        .populate("author")
        .populate("group")
        .populate({ path: "comments", model: Comment })
        .exec();
      res.status(200).set("X-Total-Count", totalItemsCount).json(feeds);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getFeedById(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const feed = await Feed.findOne({ _id: req.params.id }).populate({
        path: "comments",
        model: Comment,
      });
      res.status(200).json(feed);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  },
};
