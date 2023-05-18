'use strict'

const uuid = require('uuid')
const AWS = require('aws-sdk')
const mongoClient = require('../../resources/database')
const userModel = require('../../resources/userModel')
const dynamoDb = new AWS.DynamoDB.DocumentClient()
module.exports.verifyOtp = (event, context, callback) => {
  const data = JSON.parse(event.body)
    try {
        if (data.phone) {
          mongoClient().then(()=>{
            //find the user with valid otp check
            userModel.findOne({
                phone: data.phone
            }, async (error, result) => {
                if (error) {
                    callback(null, {
                        statusCode:  500,
                        headers: { 'Content-Type': 'text/plain' },
                        body: "Something went wrong."
                      })
                } else {
                    if (result) {
                        //cheking otp and expiryTime
                        if(req.otp != result.otp){
                            return callback(null, {
                                statusCode:  409,
                                headers: { 'Content-Type': 'text/plain' },
                                body: "Otp mismatched."
                              })
                        }
                        if(Date.now() > result.otpExpiry){
                            return callback(null, {
                                statusCode:  409,
                                headers: { 'Content-Type': 'text/plain' },
                                body: "Otp mismatched."
                              })
                        }
                        userModel.updateOne(
                            {
                                phone : data.phone
                            },
                            {
                                $set : {
                                    status : 'VERIFIED'
                                }
                            },{},
                            (error,result)=>{
                                if(error){
                                    callback(null, {
                                        statusCode:  500,
                                        headers: { 'Content-Type': 'text/plain' },
                                        body: "Something went wrong."
                                      })
                                } else {
                                    callback(null, {
                                        statusCode:  200,
                                        body: "Phone number verified successfully."
                                      })
                                }
                            }
                        )
                        
                    } else {
                        callback(null, {
                            statusCode:  409,
                            headers: { 'Content-Type': 'text/plain' },
                            body: "Phone Number does not exist."
                          })
                    }
                }
            })

          })


        } else {
            callback(null, {
                statusCode:  400,
                headers: { 'Content-Type': 'text/plain' },
                body: "Bad Request."
              })
        }
    } catch (error) {
        callback(null, {
            statusCode:  500,
            headers: { 'Content-Type': 'text/plain' },
            body: "Something went wrong."
          })
    }

}
