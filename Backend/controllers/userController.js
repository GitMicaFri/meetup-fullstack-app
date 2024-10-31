const express = require('express');
const serverless = require('serverless-http');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../db');

const app = express();
app.use(express.json()); // Middleware för att hantera JSON

// Definiera din route
app.post('/api/users/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        const params = {
            TableName: 'Meetup-Users',
            Item: {
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
            },
        };

        await dynamoDB.put(params).promise();

        res.status(201).json({
            message: 'User created successfully',
            user: email,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exportera appen som en Lambda-handler
module.exports.handler = serverless(app);
