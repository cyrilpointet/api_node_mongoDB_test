const mongoose = require('mongoose');
const Member = require('./Member');

const Group = mongoose.Schema({
    name: { type: String, required: true },
});

Group.virtual('id').get(function(){
    return this._id.toHexString();
});

Group.virtual('members', {
    ref: 'Member',
    localField: '_id',
    foreignField: 'groups'
});

Group.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Group', Group);
