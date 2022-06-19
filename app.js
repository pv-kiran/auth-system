const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({extended: false}))


var cookieParser = require('cookie-parser')
app.use(cookieParser())



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('./middleware/auth');
const User =require('./model/User');
const connect = require('./config/database');
connect();

app.get('/' , (req,res) => {
    res.send('Hello from auth system');
});


app.post('/register' , async (req,res) => {
    const {firstName , lastName , email , password, country} = req.body;
    if(!(email && firstName && lastName && email && password && country)) {
        res.send(400).send('Please provide all fields');
    } 
    try {
        const existingUser =  await User.findOne({ email: email }); // PROMISE
        if(existingUser) {
            res.status(400).send('User is already existing');
        } else {
            const encryptedPswd = await bcrypt.hash(password , 10);
            const user = await User.create({
                firstName,
                lastName,
                email,
                password: encryptedPswd,
                country
            })
            // token creation
            console.log(user.id)
            const token = jwt.sign({user_id: user._id , email} , process.env.SECRET , {expiresIn: '2h'});
            user.token = token;
            user.password = undefined;
            res.status(201).json({user: user});
        }
    } catch (err) {
        res.status(501).send('Something is wrong with Server.. Please try after some minutes');
    }
})

app.post('/login', async (req,res) => {
    try {
        const { email , password } = req.body ;
        if(!(email && password)) {
            res.status(400).send('Field is missing');
        } else {
            const user = await User.findOne({email: email});
            if(!user) {
                res.status(404).send('Your are not registered to our system');
            } 
            const checkPswd = await bcrypt.compare(password,user.password)
            if(checkPswd) {
                 const token = jwt.sign({user_id: user.id , email}, process.env.SECRET , {expiresIn: '2h'});
                 user.token = token ;
                 user.password = undefined; // to hide password from response
                 res.status(200).json(user);

                // if we go with cookies
                // expires in 3 days
                // const options = {
                //     expires: new Date(Date.now() + 3*24*60*60* 1000) ,
                //     httpOnly: true
                // }
                // res.status(200).cookie('token',token , options).json({
                //     success: true,
                //     token: token,
                //     user
                // })

            } else {
                 res.status(400).send('Email or password is incorrect');
            }
        }
    } catch (err) {
        res.status(501).send('Something wrong with Server')
    }
})


app.get('/dashboard',auth,(req,res) => {
  res.send('Welcome to secret route');
})


// route for login if we go with cookie based authentication

// app.post('/logout' ,(req,res) => {
//      res.clearCookie('token');
//      res.send('Cookie deleted');
// })


module.exports = app;