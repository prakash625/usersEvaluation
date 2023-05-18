var jwt = require('jsonwebtoken');

module.exports = {
    verifyToken : ( req,res,next )=>{
        try {
          if(req.header.token){
            var decoded = jwt.verify(token, process.env.JWT_SECRET);
            if(decoded){
                req.body.mergedContact = decoded.mergedContact;
                next()
            } else {
                res.status(400).send({message:'Invalid Token'})
            }
          }
        } catch(error){
            res.status(500).send({message:'Something went wrong'})
        }
    }
}