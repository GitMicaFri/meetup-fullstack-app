const dynamoDB = require('../db')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

module.exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body)

        if (!data.firstName || !data.lastName || !data.email || !data.password) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Lägg till CORS-header
                },
                body: JSON.stringify({
                    error: 'Missing required fields'
                })
            }
        }

        const userId = uuidv4()
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const params = {
            TableName: 'Meetup-Users',
            Item: {
                userId: userId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashedPassword
            }
        }

        await dynamoDB.put(params).promise()

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*", // Lägg till CORS-header
            },
            body: JSON.stringify({
                message: 'User created successfully',
                user: data.email
            })
        }

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Lägg till CORS-header
            },
            body: JSON.stringify({
                error: error.message
            })
        }
    }
}
