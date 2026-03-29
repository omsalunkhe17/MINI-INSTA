const jwt = require('jsonwebtoken')


async function identidyUser(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Token not provided , Unauthorized access"
        })
    }


    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message:"Invalid token , Unauthorized access"
        })
    }

    req.user = decoded
    next()
}

module.exports = identidyUser