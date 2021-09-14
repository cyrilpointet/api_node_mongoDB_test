const Article = require('../models/Article');

exports.createArticle = (req, res, next) => {
    delete req.body._id;
    const product = new Article({
        ...req.body
    });
    product.save()
        .then(() => res.status(201).json(product))
        .catch(error => res.status(400).json({ error }));
}

exports.getAllArticles = async (req, res, next) => {
    try {
        const totalArticles = await Article.find().exec();
        const totalLength = totalArticles.length;
        const products = await Article
            .find()
            .sort(req.query.sort ?
                {[req.query.sort]: req.query.order === 'ASC' ? 1 : -1} :
                {})
            .limit(req.query.perPage ? parseInt(req.query.perPage) : 0)
            .skip(req.query.page && req.query.perPage ? (parseInt(req.query.page) - 1) * parseInt(req.query.perPage): 0)
            .exec();
        res.status(200).set('X-Total-Count', totalLength).json(products);
    } catch (e) {
        res.status(500).json({ error: e.message })
    }

}

exports.getArticleById = (req, res, next) => {
    Article.findOne({ _id: req.params.id })
        .then(product => res.status(200).json(product))
        .catch(error => res.status(404).json({ error }));
}

exports.updateArticle = async (req, res, next) => {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, {...req.body}, { new: true }).exec();
    res.status(200).json(updatedArticle);
}

exports.deleteArticle = (req, res, next) => {
    Article.deleteOne({ _id: req.params.id })
        .then((resp) => res.status(200).json(resp))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteManyArticles = (req, res, next) => {
    Article.deleteMany(
        {
            _id: {
                $in: req.body.ids
            }
        }
    )
        .then((resp) => res.status(200).json(req.body.ids))
        .catch(error => res.status(400).json({ error }));
}
