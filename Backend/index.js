require('dotenv').config()
const express = require('express')
const serverless = require('serverless-http')
const apiRoutes = require('./routes/apiRoutes') 


const app = express()


app.use(express.json())

app.use('/api', apiRoutes) 




module.exports.handler = serverless(app)
