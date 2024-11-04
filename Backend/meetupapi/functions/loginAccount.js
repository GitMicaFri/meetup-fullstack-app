const bcrypt = require('bcryptjs')
const dynamoDB = require('../db')

module.exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body)

        if(!data.email || !data.password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Email and password required'
                })
            }
        }

        // Vi använder oss här utav det nyskapade global secondary index, GSI, för att söka med email som partition key, istället för userId
        const params = {
            TableName: 'Meetup-Users',
            IndexName: 'EmailIndex',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': data.email
            }
        }

        const result = await dynamoDB.query(params).promise()

        if (result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'User not found'
                })
            }
        }

        const user = result.Items[0]

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password
        )

        if (!isPasswordValid) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    error: 'Incorrent password'
                })
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Login successful',
                user: user.email
            })
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        }
    }
}