
/**
 * Define the Users' storage
 */
const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true}
});

userSchema.plugin(mongooseUniqueValidator);

module.exports= mongoose.model("UserEnty", userSchema);
