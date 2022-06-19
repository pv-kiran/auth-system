const mongoose = require('mongoose');
const  { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String ,
        default: null
    } ,
    lastName: {
        type: String ,
        default: null
    } ,
    email: {
        type: String,
        unique: true
    } ,
    password: {
        type: String
    } ,
    token: {
        type: String
    }
})



const User = mongoose.model('user' , userSchema);
module.exports = User;