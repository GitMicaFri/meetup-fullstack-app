const express = require('express')
const { createUser } = require('../controllers/userController') 
const router = express.Router()

router.post('/users/register', createUser)


module.exports = router