const express = require('express');
const userController = require('../controller/userController')
const tokenVerification = require('../authorisationMiddleware/authoriseRequest')
const router = express.Router();

// Define the home route
router.post('sendOtp', (req,res)=>{
    userController.sendOtp(req.body,result=>{
        res.status(result.code).send(result)
    })
} );
router.post('verifyOtp', tokenVerification.verifyToken, (req,res)=>{
    userController.verifyOtp(req.body,result=>{
        res.status(result.code).send(result)
    })
} );

module.exports = router;