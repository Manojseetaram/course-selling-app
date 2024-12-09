const jwt = require("jsonwebtoken")
const {JWT_ADMIN_SECRET} = require("../config");

function adminjwtverify (req,res,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token,JWT_ADMIN_SECRET)
    if(decoded){
    req.userId = decoded.indexOf;
    next()
    }else{
        res.status(403).json({
            message :"You are not signed in"
        })
    }
}

module.exports={
    adminjwtverify
}