const jwt=require('jsonwebtoken')
const redis=require('redis')

const redisClient=redis.createClient(process.env.REDIS_URI)

const handleSignin = (db, bcrypt,req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            return user[0]
          })
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}
const getAuthTokenId =(authorization,res)=>{
  return redisClient.get(authorization,(err,reply)=>{
    if(err || !reply){
      return res.status(400).json("No token found")
    }
    return res.status(200).json({id:reply})
  })
}

const setToken=(key,value)=>{
  return Promise.resolve(redisClient.set(key,value))
}
const signToken =(email)=>{
  return jwt.sign({email},"JWT_SECRET",{"expiresIn":'2days'})
}

const createSession =(data)=>{
  const {id ,email}=data
  const token = signToken(email)
  return setToken(token,id)
  .then(resp => {return {"success":true,userId:id,token}})
  .catch(err => console.log)
  
}

const signInAuthentication =(db, bcrypt)=>(req,res)=>{
  const {authorization} = req.headers
  return authorization?getAuthTokenId(authorization,res):
    handleSignin(db,bcrypt,req,res)
    .then(data => {
       return data.id && data.email?createSession(data):Promise.reject("No user")
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err))
}

module.exports = {
  signInAuthentication: signInAuthentication,
  redisClient:redisClient
}