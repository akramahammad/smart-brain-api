const redisClient=require('./signin').redisClient

const handleSignOut =(req,res)=>{
    const {authorization}=req.headers
    return redisClient.del(authorization,(err,reply)=>{
        if(err || !reply){
            return res.status(400).json("Error signing out")
        }
        return res.status(200).json("Signed out successfully")
    })
}

module.exports={
    handleSignOut
}