const jwt = require('jsonwebtoken');
const { error } = require('node:console');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({error: "Protected route"});
    }
    try{
        const exists = jwt.verify(token, process.env.JWT_SECRET);// If the token is fake or expired, the jwt.verify() automatically throws an error for us
        req.userId = exists.userId;
        next();
    } catch( error ){
        return res.status(401).json({error : "Token not valid"});
    }
}