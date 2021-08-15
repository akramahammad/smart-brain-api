const redisClient=require('./signin').redisClient

const requireAuth =(req,res,next)=>{
    const {authorization}=req.headers
    if(authorization){
        return redisClient.get(authorization,(err,reply)=>{
            if(err || !reply){
                return res.status(401).json("Unauthorized")
            }
            return next()
        })
    }
    return res.status(401).json("Unauthorized")
}

module.exports={
    requireAuth
}