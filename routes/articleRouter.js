const express = require('express');
const articlesRouter = express.Router();

const auth = require('../middleware/auth');
const articlesCtrl = require('../controllers/articlesController');

articlesRouter.post('/', auth, articlesCtrl.createArticle)

articlesRouter.get('/', auth, articlesCtrl.getAllArticles);
articlesRouter.get('/:id', auth, articlesCtrl.getArticleById);

articlesRouter.put('/:id', auth, articlesCtrl.updateArticle);

articlesRouter.delete('/:id', auth, articlesCtrl.deleteArticle);
articlesRouter.delete('/', auth, articlesCtrl.deleteManyArticles);

export default articlesRouter;
