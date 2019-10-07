const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) =>{
    // Get the token from header
    const token = req.header('x-auth-token');

    //Check if token is not available
    if(!token){
        return res.status(401).json({msg: 'No token, Authorization denied' });
    }
    // Verify the token
    try{
        const decoded = jwt.verify(token, config.get('jwtToken'));
        req.user = decoded.user;
        next();
    }
    catch(err){
        console.error('Token is invalid');
        res.status(401).json({msg: 'Invalid authorization token'});
    }
}
