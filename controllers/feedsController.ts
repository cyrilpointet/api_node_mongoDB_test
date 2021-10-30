import express from "express";
import { Feed } from "../models/Feed";
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
      ).count();
      const products = await Feed.find(QueryHelper.getQueryFilters(req))
        .sort(QueryHelper.getQuerySort(req))
        .limit(QueryHelper.getQueryLimit(req))
        .skip(QueryHelper.getQuerySkip(req))
        .populate("author")
        .populate("group")
        .exec();
      res.status(200).set("X-Total-Count", totalItemsCount).json(products);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getFeedById(req: express.Request, res: express.Response): void {
    Feed.findOne({ _id: req.params.id })
      .then((product) => res.status(200).json(product))
      .catch((error) => res.status(404).json({ error }));
  },
};
