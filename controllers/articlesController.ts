import express from "express";
import { Article } from "../models/Article";
import { QueryHelper } from "../services/QueryHelper";

type articlesCtrlType = {
  createArticle: (req: express.Request, res: express.Response) => void;
  getAllArticles: (
    req: express.Request,
    res: express.Response
  ) => Promise<void>;
  getArticleById: (req: express.Request, res: express.Response) => void;
  updateArticle: (req: express.Request, res: express.Response) => Promise<void>;
  deleteArticle: (req: express.Request, res: express.Response) => void;
  deleteManyArticles: (req: express.Request, res: express.Response) => void;
};

export const articlesCtrl: articlesCtrlType = {
  createArticle(req: express.Request, res: express.Response): void {
    delete req.body._id;
    const product = new Article({
      ...req.body,
    });
    product
      .save()
      .then(() => res.status(201).json(product))
      .catch((error) => res.status(400).json({ error }));
  },

  async getAllArticles(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const totalItemsCount = await Article.find(
        QueryHelper.getQueryFilters(req)
      ).count();
      const products = await Article.find(QueryHelper.getQueryFilters(req))
        .sort(QueryHelper.getQuerySort(req))
        .limit(QueryHelper.getQueryLimit(req))
        .skip(QueryHelper.getQuerySkip(req))
        .exec();
      res.status(200).set("X-Total-Count", totalItemsCount).json(products);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getArticleById(req: express.Request, res: express.Response): void {
    Article.findOne({ _id: req.params.id })
      .then((product) => res.status(200).json(product))
      .catch((error) => res.status(404).json({ error }));
  },

  async updateArticle(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).exec();
    res.status(200).json(updatedArticle);
  },

  deleteArticle(req: express.Request, res: express.Response): void {
    Article.deleteOne({ _id: req.params.id })
      .then((resp) => res.status(200).json(resp))
      .catch((error) => res.status(400).json({ error }));
  },

  deleteManyArticles(req: express.Request, res: express.Response): void {
    Article.deleteMany({
      _id: {
        $in: req.body.ids,
      },
    })
      .then(() => res.status(200).json(req.body.ids))
      .catch((error) => res.status(400).json({ error }));
  },
};
