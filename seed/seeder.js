const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Member = require('../models/Member');
const Group = require('../models/Group');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser   : true,
    dbName            : 'apinode',
    user: 'api',
    pass: 'docker1234'
});

async function seedProducts() {
    const products = await Product.find();
    if (1 > products.length) {
        for (let i = 0; i < 20; i++) {
            const product  = new Product({
                title: `Product ${i}`,
                description: `Description ${i}`,
                price: i
            })
            await product.save();
        }
    }
}

async function seedMembers() {
    const members = await Member.find();
    for (let i = 0; i < members.length; i++) {
        members[i].delete();
    }
    const gryffondor = await Group.findOne({ name: 'gryffondor' });
    for (let i = 0; i < 5; i++) {
        const member  = new Member({
            name: `Harry ${i}`,
            email: `Harry_${i}@poudlard.com`,
        })
        member.groups.push(gryffondor._id);
        await member.save();
    }

    const serpentard = await Group.findOne({ name: 'serpentard' });
    for (let i = 0; i < 5; i++) {
        const member  = new Member({
            name: `Draco ${i}`,
            email: `Draco_${i}@poudlard.com`,
        })
        member.groups.push(serpentard._id);
        await member.save();
    }

    const poufsouffle = await Group.findOne({ name: 'poufsouffle' });
    for (let i = 0; i < 5; i++) {
        const member  = new Member({
            name: `Norbert ${i}`,
            email: `Norbert_${i}@poudlard.com`,
        })
        member.groups.push(poufsouffle._id);
        await member.save();
    }

    const serdaigle = await Group.findOne({ name: 'serdaigle' });
    for (let i = 0; i < 5; i++) {
        const member  = new Member({
            name: `Luna ${i}`,
            email: `Luna_${i}@poudlard.com`,
        })
        member.groups.push(serdaigle._id);
        await member.save();
    }
}

async function seedGroups() {
    const groups = await Group.find();
    for (let i = 0; i < groups.length; i++) {
        groups[i].delete();
    }
    const gryffondor  = new Group({
        name: 'gryffondor',
    })
    await gryffondor.save();
    const serdaigle  = new Group({
        name: 'serdaigle',
    })
    await serdaigle.save();
    const poufsouffle  = new Group({
        name: 'poufsouffle',
    })
    await poufsouffle.save();
    const serpentard  = new Group({
        name: 'serpentard',
    })
    await serpentard.save();
}

async function seedAdmin() {
    const admin = await User.findOne({email: 'admin@admin.admin'}).exec();
    if (null === admin) {
        const hash = await bcrypt.hash('admin', 10);
        const user = new User({
            email: 'admin@admin.admin',
            password: hash
        });
        await user.save()
    }
    await seedProducts();
    await seedGroups();
    await seedMembers();
    mongoose.disconnect();
}

seedAdmin();
