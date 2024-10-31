const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const dynamoDB = require('../db')

exports.createUser = async (req, res) => {

    const { firstName, lastName, email, password } = req.body

    try {

        const hashedPassword = await bcrypt.hash(password, 10) // hasha lösenordet
        const userId = uuidv4() // skapa ett unikt användarID med uuidv4

        const params = { // delge vad för information som ska in i databasen, lägg in dem i "params"
            TableName: 'Meetup-Users',
            Item: {
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword
            }
        }
        

        await dynamoDB.put(params) // sätta in informationen i databasen 

        res.status(201).json({
            message: 'User created successfully',
            user: email
        })
    

    } catch (error) {
        res.status(500).json({ 
            error: error.message
        })
    }

}