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
  async createArticle(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      delete req.body._id;
      const product = new Article({
        ...req.body,
      });
      await product.save();
      res.status(201).json(product);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getAllArticles(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const totalItemsCount = await Article.find(
        QueryHelper.getQueryFilters(req)
      ).estimatedDocumentCount();
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

  async getArticleById(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const product = await Article.findOne({ _id: req.params.id });
      res.status(200).json(product);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
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

  async deleteArticle(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const resp = await Article.deleteOne({ _id: req.params.id });
      res.status(200).json(resp);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async deleteManyArticles(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      await Article.deleteMany({
        _id: {
          $in: req.body.ids,
        },
      });
      res.status(200).json(req.body.ids);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
};
