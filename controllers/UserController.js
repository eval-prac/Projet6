
/**
 * Controller for users
 */
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserEntity = require("../models/UserEntity");

UserController = {};

/**
 * Signup new user and store in the database.
 * Bcrypt encryption of password
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
exports.signup = (req, resp, next)=> {
    bcrypt.hash(req.body.password, 10)
        .then( hash => {
            const userEntity = new UserEntity({email:req.body.email, password:hash})
            userEntity.save()
                .then(userEntity => resp.status(201).json({message:"New user added"}) )
                .catch(error => resp.status(400).json({error}) );
        })
        .catch( error => resp.status(500).json({error}) );
}

/**
 * Login an existing user of the database.
 * Usage og bcrypt to security check of the right password
 * Generate a temporary token to the webClient
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
exports.login = (req, resp, next)=> {
    UserEntity.findOne({email:req.body.email})
    .then(userEntity => {
        if (userEntity==null) {
            return resp.status(401).json({message:"Utilisateur non trouvé"});
        }
        bcrypt.compare(req.body.password, userEntity.password)
        .then(validity => {
            if ( !validity ) {
                return resp.status(401).json({message:"Mot de passe incorrect"}); 
            } else {
                const token=jsonwebtoken.sign(
                    {userId:userEntity._id},
                    "key2000",
                    {expiresIn:"24h"}
                );
                return resp.status(200).json({
                    userId:userEntity._id,
                    token:token
                });
            }
        } )
        .catch( () => resp.status(500).json({message:"Unauthorized"}) );
    })
    .catch(error => resp.status(500).json({error}));
}

//module.exports=UserController;
