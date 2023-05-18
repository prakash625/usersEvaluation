// Your AccountSID and Auth Token from console.twilio.com


const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

module.exports = {

    sendMessage: (body) => {
        return new Promise((resolve, reject) => {
            client.messages
                .create({
                    body: body.subject,
                    to: body.number, // Text your number
                    from: process.env.TWILIO_NO, // From a valid Twilio number
                })
                .then((message) => resolve(message))
                .catch((error)=> reject(error));
        })
    },
    generateOtp : () =>{
        return new Promise((resolve, reject) => {
            var val = Math.floor(1000 + Math.random() * 9000);
            resolve(val)
        })
    }
}

