const mongoose = require('mongoose');

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

Group.pre('remove', function(next){
    this.model('Member').updateMany(
        {groups: {$in: [this._id]}},
        {$pull: {groups: this._id}},
        next
    )
});

module.exports = mongoose.model('Group', Group);
