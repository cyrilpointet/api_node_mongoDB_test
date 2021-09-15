import mongoose from "mongoose";

const GroupSchema = mongoose.Schema({
    name: { type: String, required: true },
});

GroupSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

GroupSchema.virtual('members', {
    ref: 'Member',
    localField: '_id',
    foreignField: 'groups'
});

GroupSchema.set('toJSON', {
    virtuals: true
});

GroupSchema.pre('remove', function(next){
    this.model('Member').updateMany(
        {groups: {$in: [this._id]}},
        {$pull: {groups: this._id}},
        next
    )
});

export const Group = mongoose.model('Group', GroupSchema);
