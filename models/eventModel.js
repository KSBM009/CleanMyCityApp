const mongoose = require("mongoose");
var eventSchema = mongoose.Schema({
    eventId: {type:String,required:true},
    eventTitle: {type:String,required:true},
    eventDescription: {type:String,required:true},
    eventLocation: {type:String},
    eventHostTime: {type:DateTime,required:true},
    status: {type:String,default:"Waiting for admins approval"},
    volunteersReq: {type:Number},
    createdAt: {type:BSON,required:true},
    lastUpdatedAt: {type:BSON,required:true}
});

module.exports = mongoose.model("eventModel",eventSchema);