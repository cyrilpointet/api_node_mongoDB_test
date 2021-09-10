const mongoose = require('mongoose');

const Member = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group"
        }
    ]
});

Member.virtual('id').get(function(){
    return this._id.toHexString();
});

Member.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Member', Member);
