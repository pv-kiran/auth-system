const mongoose = require('mongoose');
const { MONGO_URL } =  process.env;

const connect = () => {
    mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('DB connection is successfull');
    })
    .catch(err => {
        console.log('DB conection is failed');
        console.log(err);
        process.exit(1)
    })
}

module.exports = connect