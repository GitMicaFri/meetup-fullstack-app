const dynamoDB = require('../db');

// Huvudfunktion för att hämta alla användare
module.exports.handler = async (event) => {
    try {
        const params = {
            TableName: 'Meetup-Users',
        };

        const result = await dynamoDB.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'All users: ',
                users: result.Items,
            }),
        };
    } catch (error) {
        return {
            responseCode: 500,
            body: JSON.stringify({
                error: error.message,
            }),
        };
    }
};
