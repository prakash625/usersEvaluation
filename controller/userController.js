const commonService = require('../commonService/commonService')
const userModel = require('../models/userModel').User;
var jwt = require('jsonwebtoken');


module.exports = {
    sendOtp: async (req, res) => {
        try {
            if (req.number && req.countryCode) {
                let mergedContact = req.countryCode + req.phone
                //find the user in exiting verified users
                userModel.findOne({
                    mergedContact: mergedContact,
                    status: 'VERIFIED'
                }, async (error, result) => {
                    if (error) {
                        res({
                            status: 500,
                            error: 'Something went Wrong.'
                        })
                    } else {
                        if (result) {
                            res({
                                status: 409,
                                error: 'Phone Number is already verified.'
                            })
                        } else {
                            //firstly sending the otp then creating a user object in db
                            let otp = await commonService.generateOtp()
                            let sendOtpResponse = await commonService.sendMessage({
                                subject: `Your verification code is ${otp}`,
                                number: mergedContact
                            })
                            if (sendOtpResponse.sid) {
                                //created user Object
                                let userObject = {
                                    phone: req.phone,
                                    countryCode: req.countryCode,
                                    mergedContact: mergedContact,
                                    otp: otp,
                                    otpExpiry: Date.now() + 120000
                                }
                                // Create a new user document based on the request body
                                const user = new userModel(userObject);
                                // Save the user document to the database
                                await user.save();
                                // Send a success response
                                //Providing token for after apis authorization
                                var token = jwt.sign({mergedContact: mergedContact}, process.env.JWT_SECRET);
                                res({
                                    code : 201,
                                    message : 'User created successfully',
                                    token : token
                                })
                            } else {
                                res({
                                    status: 500,
                                    error: 'Error sending otp'
                                })
                            }

                        }
                    }
                })


            } else {
                res({
                    status: 400,
                    error: 'Bad Request'
                })
            }
        } catch (error) {
            res({
                status: 500,
                error: error
            })
        }

    },

    verifyOtp : async (req, res) => {
        try {
            if (req.mergedContact) {
                //find the user with valid otp check
                userModel.findOne({
                    mergedContact: mergedContact
                }, async (error, result) => {
                    if (error) {
                        res({
                            status: 500,
                            error: 'Something went Wrong.'
                        })
                    } else {
                        if (result) {
                            //cheking otp and expiryTime
                            if(req.otp != result.otp){
                                res({
                                    status: 404,
                                    error: 'Otp Not Matched.'
                                })
                                return;
                            }
                            if(Date.now() > result.otpExpiry){
                                res({
                                    status: 404,
                                    error: 'Otp Expired!'
                                })
                                return;
                            }
                            userModel.updateOne(
                                {
                                    mergedContact : req.mergedContact
                                },
                                {
                                    $set : {
                                        status : 'VERIFIED'
                                    }
                                },{},
                                (error,result)=>{
                                    if(error){
                                        res({
                                            status: 500,
                                            error: 'Something went wrong'
                                        })
                                        return;
                                    } else {
                                        res({
                                            status: 200,
                                            error: 'Phone number verified successfully.'
                                        })
                                        return;
                                    }
                                }
                            )
                            
                        } else {
                            res({
                                status: 409,
                                error: 'Phone Number does not exist.'
                            })
                        }
                    }
                })


            } else {
                res({
                    status: 400,
                    error: 'Bad Request'
                })
            }
        } catch (error) {
            res({
                status: 500,
                error: error
            })
        }
    }

}