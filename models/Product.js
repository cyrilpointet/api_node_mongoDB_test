const mongoose = require('mongoose');

const Product = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

Product.virtual('id').get(function(){
    return this._id.toHexString();
});

Product.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Product', Product);
