const jwt = require('jsonwebtoken');
const User = require('../model/User');


const auth = (req,res,next) => {
    // console.log(req.headers);
    // console.log(req.header);
    const token = req.cookies.token || req.headers.authorization.replace('Bearer ' , '')  ;
    // console.log(token);

    if(!token) {
        return res.status(403).send('Token is missing');
    }

    try {
        const decode = jwt.verify(token,process.env.SECRET);
        // console.log(decode);
        req.user = decode;
    } catch (error) {
        return res.status(401).send('Invalid token')
    }
    return next();
}

module.exports = auth;