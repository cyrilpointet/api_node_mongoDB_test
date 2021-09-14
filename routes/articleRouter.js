const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const thingsCtrl = require('../controllers/articlesController');

router.post('/', auth, thingsCtrl.createArticle)

router.get('/', auth, thingsCtrl.getAllArticles);
router.get('/:id', auth, thingsCtrl.getArticleById);

router.put('/:id', auth, thingsCtrl.updateArticle);

router.delete('/:id', auth, thingsCtrl.deleteArticle);
router.delete('/', auth, thingsCtrl.deleteManyArticles);

module.exports = router;
