
const express = require('express');
const sls = require('serverless-http');
const usersRoute = require('./routes/userRoute');
require('dotenv').config();

// Create an instance of express app
const app = express();

app.use('/', usersRoute);

// Export the express app as a serverless function named "server"
module.exports.server = sls(app);