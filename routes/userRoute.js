const express = require("express");
var router = express.Router();

var userModel = require('../models/usersModel');

// router.get('/reg',async(req,res)=>{
//     try{
//         var{Name,RollNo,EmailId,Password,address} = req.query;
//         if(!EmailId){
//             res.status(200).json({
//                 msg:"User Email Not Found"
//             });
//             return;
//         }
//         if(!Password){
//             res.status(200).json({
//                 msg:"User Password Not Found"
//             });
//             return;
//         }
//         var user = new userModel();
//         user.Name = Name;
//         user.RollNo = RollNo;
//         user.EmailId = EmailId;
//         user.Password = Password;
//         user.address = address;
//         await user.save()
//         res.status(200).json({
//             msg:"Saved",
//             data: user
//         })
//     }catch(e){
//         console.log(e);
//         res.status(500).json({
//             msg:"Error in Saving!"
//         })
//     }
// });

module.exports = router;