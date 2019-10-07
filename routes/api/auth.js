const express = require('express');
const authRoute = express.Router();
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

//@route   GET api/auth
//@desc    Test auth route    
//@access  Public
authRoute.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


//@route   POST api/auth
//@desc    USER LOGIN ROUTE    
//@access  PUBLIC

authRoute.post('/',[
    check('email', 'Please enter a valid email')
    .isEmail(),
    check('password', 'Password is required')
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const { email, password} = req.body;

    try{
         // See if the user exists
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors: [{
                msg: 'Invalid credentials'
            }]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        //If the password doesn't match
        if(!isMatch){
            return res.status(400).json({errors: [{
                msg: 'Invalid credentials'
            }]});
        }

        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 
            config.get('jwtToken'),
            {expiresIn: 3600000},
            (err, token) => {
                if(err) throw err;
                res.json({ token })
            });
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }  
});

module.exports = authRoute;