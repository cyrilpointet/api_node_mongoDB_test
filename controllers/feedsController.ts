import express from "express";
import { Feed } from "../models/Feed";

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
      const totalFeeds = await Feed.find().exec();
      const totalLength = totalFeeds.length;
      const products = await Feed.find()
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
        .populate("author")
        .populate("group")
        .exec();
      res.status(200).set("X-Total-Count", totalLength).json(products);
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
