const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: {
      type: String,
      required: true
    },
    mergedContact : {
        type: String,
        required: true
    },
    countryCode :{
      type: String,
      required: true
    },
    status: {
      type: String,
      enum : ['VERIFIED' , 'NOTVERIFIED'],
      default : 'NOTVERIFIED'
    },
    otp : {
        type : Number
    },
    otpExpiry : {
        type : Number
    }
  });
  
  // Define a Mongoose model for the "User" schema
  const User = mongoose.model('User', userSchema);

  module.exports={User : User}