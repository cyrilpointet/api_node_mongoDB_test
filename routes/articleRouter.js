import express from 'express';
import {auth} from '../middleware/auth';
import {articlesCtrl} from '../controllers/articlesController';

const articleRouter = express.Router();

articleRouter.post('/', auth, articlesCtrl.createArticle)

articleRouter.get('/', auth, articlesCtrl.getAllArticles);
articleRouter.get('/:id', auth, articlesCtrl.getArticleById);

articleRouter.put('/:id', auth, articlesCtrl.updateArticle);

articleRouter.delete('/:id', auth, articlesCtrl.deleteArticle);
articleRouter.delete('/', auth, articlesCtrl.deleteManyArticles);

export {articleRouter};
