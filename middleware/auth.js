

const asyncHandler = require('express-async-handler');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const constants = require('../constants');
const blacklist = require('../blacklist');


const authenticateToken =asyncHandler(async(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(constants.UNAUTHORIZED).send("Token not found");
    
    console.log('blacklist',blacklist);

    if(blacklist.has(token)) return res.status(constants.UNAUTHORIZED).send("Token Expired");
     

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(constants.FORBIDDEN).send("Invalid Token");
        req.user= user;
       
        next();
    } )
}) 


module.exports = authenticateToken;

