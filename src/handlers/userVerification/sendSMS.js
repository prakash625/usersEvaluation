'use strict'

const uuid = require('uuid')
const AWS = require('aws-sdk')
const mongoClient = require('../../resources/database')
const userModel = require('../../resources/userModel')

module.exports.sendOtp = (event, context, callback) => {
  const data = JSON.parse(event.body)

  try {
    if (data.number && data.countryCode) {
      mongoClient().then(()=>{
        
        let mergedContact = data.countryCode + data.phone
        //find the user in exiting verified users
        userModel.findOne({
            mergedContact: mergedContact,
            status: 'VERIFIED'
        }, async (error, result) => {
            if (error) {
              callback(null, {
                statusCode:  500,
                headers: { 'Content-Type': 'text/plain' },
                body: "Something went wrong."
              })
            } else {
                if (result) {
                    callback(null, {
                      statusCode: 409,
                      headers: { 'Content-Type': 'text/plain' },
                      body: "Phone Number is already verified."
                    })
                } else {
                    //firstly sending the otp then creating a user object in db
                    let otp = Math.floor(1000 + Math.random() * 9000);
                    let sendOtpResponse = await commonService.sendMessage({
                        subject: `Your verification code is ${otp}`,
                        number: mergedContact
                    })
                    if (sendOtpResponse.sid) {
                        //created user Object
                        let userObject = {
                            phone: data.phone,
                            otp: otp,
                            otpExpiry: Date.now() + 120000
                        }
                        // Create a new user document based on the request body
                        const user = new userModel(userObject);
                        // Save the user document to the database
                        await user.save();
                        // Send a success response
                        //Providing token for after apis authorization
                        callback(null, {
                          statusCode: 200,
                          body: "Verification code sent successfully."
                        })
                    } else {
                      callback(null, {
                        statusCode: 500,
                        headers: { 'Content-Type': 'text/plain' },
                        body: "Internal server Error"
                      })
                    }

                }
            }
        })
      })


    } else {
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: "Bad Request."
      })
    }
} catch (error) {
  callback(null, {
    statusCode: 500,
    headers: { 'Content-Type': 'text/plain' },
    body: "Something went wrong."
  })
}
}
