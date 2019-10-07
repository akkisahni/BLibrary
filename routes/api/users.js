const express = require('express');
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const userRoute = express.Router();

//@route   POST api/user
//@desc    Post the user    
//@access  Public

userRoute.route('/')
.post([
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please enter a valid email')
    .isEmail(),
    check('password', 'Please enter a valid password of minLength 6 characters').isLength({min:6})
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const { name, email, password} = req.body;

    try{
         // See if the user exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors: [{
                msg: 'user already exists'
            }]});
        }

        // Get the user gravatar
        const avatar = gravatar.url(email, {
            s: '200', // Size
            r: 'pg', // Rating
            d: 'mm' // Default
          });

        user = new User({
            name,
            email,
            password,
            avatar
        });

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();

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

module.exports = userRoute;