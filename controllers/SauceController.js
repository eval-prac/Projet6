
/**
 * Controller for sauces
 */
const UserEntity = require("../models/UserEntity");
const SauceEntity = require("../models/SauceEntity");

const SauceController = {};

/**
 * Add one sauce in the database
 * Store the picture on FS if exist
 * Store the url of the picture in the database
 * @param {} req 
 * @param {*} resp 
 * @param {*} next 
 */
SauceController.create= (req, resp, next) => {
    const sauce = JSON.parse(req.body.sauce);
    delete sauce._id;
    delete sauce.__v;
    const sauceEntity = new SauceEntity({
        ...sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:0,
        dislikes:0,
        usersLiked:[],
        usersDisliked:[]
    });
    sauceEntity.save()
        .then(sauceEntity => resp.status(201).json({message:"Sauce created"}) )
        .catch(error => resp.status(500).json({error}) );
};

/**
 * Update one sauce
 * Upload the new image if available
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
SauceController.update= (req, resp, next) => {
    let sauce;
    if ( req.body.sauce===undefined ) {
        sauce = {...req.body}
    } else {
        sauce = JSON.parse(req.body.sauce);
        sauce.imageUrl=`${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    delete sauce._id;
    delete sauce.__v;
    SauceEntity.updateOne({_id:req.params.id}, sauce)
    .then(sauceEntity => resp.status(200).json({message:"Sauce updated"}) )
    .catch(error => resp.status(500).json({error}) );
};

/**
 * Return all sauces
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
SauceController.findAll= (req, resp, next) => {
    SauceEntity.find()
        .then( sauceEntityList => {
            return resp.status(200).json(sauceEntityList);
        } )
        .catch( error => {
            return resp.status(500).json({error});
        });
};

/**
 * return one sauce
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
SauceController.find= (req, resp, next) => {
    SauceEntity.findOne({_id:req.params.id})
        .then(sauceEntity => resp.status(200).json(sauceEntity) )
        .catch(error => resp.status(500).json({error}));
};

/**
 * Delete one sauce of the database
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
SauceController.delete= (req, resp, next) => {
    SauceEntity.deleteOne({_id:req.params.id})
        .then(sauceEntity => resp.status(200).json({message:"Sauce deleted"}) )
        .catch(error => resp.status(500).json({error}));
};

/**
 * Udapte the likes of the user as requeted
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
SauceController.like= (req, resp, next) => {
    SauceEntity.findOne({_id:req.params.id})
    .then(sauceEntity => {
        const userId = req.body.userId;
        const like = req.body.like;

        // Likes updates
        let usersLikedArray = sauceEntity.usersLiked;
        let usersDislikedArray = sauceEntity.usersDisliked;
        usersLikedArray = removeItem(usersLikedArray, userId);
        usersDislikedArray = removeItem(usersDislikedArray, userId);
        if ( like===1 ) {
            usersLikedArray.push(userId);
        }
        if ( like===-1 ) {
            usersDislikedArray.push(userId);
        }
        sauceEntity.usersDisliked = usersDislikedArray;
        sauceEntity.usersLiked = usersLikedArray;
        
        // Update numbers
        sauceEntity.dislikes = usersDislikedArray.length;
        sauceEntity.likes = usersLikedArray.length;

        // Reccord
        delete sauceEntity._id;
        delete sauceEntity.__v;
        return SauceEntity.updateOne({_id:req.params.id}, sauceEntity);
    })
    .then(sauceEntity => resp.status(200).json({message:"Likes recorded"}) )
    .catch(error => resp.status(500).json({message:error.stack}) );
};

const removeItem = (array, itemValue) => {
    const indexOf = array.indexOf(itemValue);
    if ( indexOf!==-1 ) {
        array.splice(indexOf,1);
    }
    return array;
};
/*
        removeItem({array:usersLikedArray,itemValue:userId});
Array.prototype.remove = (element) => {
    this.slice(this.indexOf(element))
}
*/
module.exports = SauceController;
