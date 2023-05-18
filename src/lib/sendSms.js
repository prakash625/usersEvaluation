'use strict'

const uuid = require('uuid')
const AWS = require('aws-sdk')

module.exports.sendSms = async ({ data }) => {
  
  
  
  const accountSid = process.env.ACCOUNT_SID;

    // Your Auth Token from www.twilio.com/console 
    // See http://twil.io/secure for important security information
    const authToken = process.env.AUTH_TOKEN;

    // Import Twilio's Node Helper library
    // Create an authenticated Twilio Client instance
    const client = require('twilio')(accountSid, authToken);

    // Send a text message
    client.messages.create({
        body: data.subject,
        to: data.phone,  // your phone number
        from: '+12345678901' // a valid Twilio number
    }).promise()
}
