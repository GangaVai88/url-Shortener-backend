const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

router.post('/login', async (req,res, next) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Not a valid format" });
        }
        const exists = await User.findOne({ email });
        if(!exists){
            return res.status(400).json({error : " The user is not registered, please sign up "});
        }
        const isMatch = await bcrypt.compare(password, exists.password);//no rehashing reqd here, rehashing breaks as it generates a different hashed password
        if(!isMatch){
            return res.status(400).json({ error : "Password incorrect"});
        }
        else{
            const token = jwt.sign({userId : exists._id} , process.env.JWT_SECRET);
            return res.status(200).json({ "token" : token});
        }
    }
    catch(error) {
        next(error);
    }
})

module.exports = router;