const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');// ../ states that step out of the current folder to look into the parent folder while ./ represents that look into the current folder
router.post('/register', async (req, res, next) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Not a valid format" });
        }
        const exists = await User.findOne({email});
        if(exists){
            return res.status(400).json({error: "User with this email already exists. Please Log in"});
        }
        const salt = await bcrypt.genSalt(10);// 10 salt rounds are the industry standard
        const hashedPassword = await bcrypt.hash(password, salt);// we await as bcrypt operations are computationally heavy so it takes time..
        const newUser = new User({
            email : email,
            password : hashedPassword
        })
        await newUser.save();
        return res.status(200).json({message : "Account successfully created"});
    }
    catch (error){
        next(error);
    }
})

module.exports = router;