const mongoose = require("mongoose");
var usersSchema = mongoose.Schema({
    userId: {type:String},
    Name: {type:String},
    Gender: {type:String},
    EmailId: {type:String,required:true},
    Password: {type:String,required:true},
    status: {type:String,default:"Active"},
    EventCount: {type:Number,default:0},
    dob: {type:Date},
    address: {type:String}
});

module.exports = mongoose.model("usersModel",usersSchema);