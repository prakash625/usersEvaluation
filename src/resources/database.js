const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let isConnected;

module.exports = connectToDatabase = () => {
    //Check for connection exist or not
    if (isConnected) {
        console.log('=> using existing database connection');
        return Promise.resolve();
    }

    console.log('=> using new database connection');
    return mongoose.connect('mongodb://localhost:27017/verifiedUsers').then(db => {
        isConnected = db.connections[0].readyState;
    });
};