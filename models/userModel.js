const mongoose = require("mongoose");
var userSchema = mongoose.Schema({
    userId: {type:String},
    Name: {type:String},
    Gender: {type:String},
    EmailId: {type:String,required:true},
    Password: {type:String,required:true},
    status: {type:String,default:"Active"},
    address: {type:String}
});

module.exports = mongoose.model("userModel",userSchema);