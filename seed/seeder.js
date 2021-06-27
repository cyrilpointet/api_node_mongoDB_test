const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
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
    mongoose.disconnect();
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
    seedProducts();
}

seedAdmin();
