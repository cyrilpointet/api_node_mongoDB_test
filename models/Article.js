const mongoose = require('mongoose');

const Article = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
});

Article.virtual('id').get(function(){
    return this._id.toHexString();
});

Article.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Product', Article);
