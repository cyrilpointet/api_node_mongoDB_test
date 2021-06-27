const Product = require('../models/Product');

exports.createProduct = (req, res, next) => {
    delete req.body._id;
    const product = new Product({
        ...req.body
    });
    product.save()
        .then(() => res.status(201).json(product))
        .catch(error => res.status(400).json({ error }));
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const totalProducts = await Product.find().exec();
        const totalLength = totalProducts.length;
        const products = await Product
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

exports.getProductById = (req, res, next) => {
    Product.findOne({ _id: req.params.id })
        .then(product => res.status(200).json(product))
        .catch(error => res.status(404).json({ error }));
}

exports.updateProduct = async (req, res, next) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {...req.body}, { new: true }).exec();
    res.status(200).json(updatedProduct);
}

exports.deleteProduct = (req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
        .then((resp) => res.status(200).json(resp))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteManyProducts = (req, res, next) => {
    Product.deleteMany(
        {
            _id: {
                $in: req.body.ids
            }
        }
    )
        .then((resp) => res.status(200).json(req.body.ids))
        .catch(error => res.status(400).json({ error }));
}