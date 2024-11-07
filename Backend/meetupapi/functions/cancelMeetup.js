const dynamoDB = require('../db');

// Huvudfunktionen för att avregistrera en användare från en meetup
module.exports.handler = async (event) => {
    try {
        const { meetupId, userId } = JSON.parse(event.body); // Hämtar meetupId och userId från anropet

        // Kontroll om meetupId och userId finns
        if (!meetupId || !userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing meetupId or userId',
                }),
            };
        }

        // Hämtar meetup-eventet från databasen för att kontrollera anmälda användare
        const getParams = {
            TableName: 'Meetups',
            Key: { id: meetupId },
        };
        const result = await dynamoDB.get(getParams).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Meetup not found',
                }),
            };
        }

        const attendees = result.Item.attendees || [];

        // Kolla om användaren är anmäld
        if (!attendees.includes(userId)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'User is not registered for this meetup',
                }),
            };
        }

        // Uppdaterar deltagarlistan genom att ta bort användarens userId
        const updatedAttendees = attendees.filter((id) => id !== userId);

        // Uppdaterar meetupen i DynamoDB
        const updateParams = {
            TableName: 'Meetups',
            Key: { id: meetupId },
            UpdateExpression: 'SET attendees = :attendees',
            ExpressionAttributeValues: {
                ':attendees': updatedAttendees,
            },
        };

        await dynamoDB.update(updateParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User unregistered from meetup successfully',
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
            }),
        };
    }
};
