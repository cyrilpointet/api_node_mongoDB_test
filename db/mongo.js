const mongoose = require('mongoose');

const clientOptions = {
    useNewUrlParser   : true,
    dbName            : 'apinode'
};

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('********************** DB Connected **********************************');
        console.log(process.env.URL_MONGO);
    } catch (error) {
        console.log(error);
        throw error;
    }
}