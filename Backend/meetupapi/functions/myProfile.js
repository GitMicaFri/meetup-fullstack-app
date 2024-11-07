// Importerar dynamoDB-instansen från db.js
const dynamoDB = require('../db');

// Huvudfunktionen för att hämta en användarprofil baserat på användarens userId
module.exports.handler = async (event) => {
    try {
        // Hämtar userId från query parameter
        const userId = event.queryStringParameters.userId;
        console.log('Fetching profile for userId:', userId);

        // Kontrollerar att userId är med
        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing userId',
                }),
            };
        }

        // Parametrar för att hämta användarens profil från "Meetup-Users"-tabellen
        const profileParams = {
            TableName: 'Meetup-Users',
            Key: { userId: userId },
        };

        // Hämtar användarens profil från DynamoDB
        const profileData = await dynamoDB.get(profileParams).promise();

        // Kontrollerar om profilen finns
        if (!profileData.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'User not found',
                }),
            };
        }

        // Extraherar användarens namn
        const firstName = profileData.Item.firstName;
        const lastName = profileData.Item.lastName;

        // Parametrar för att söka efter meetups där användaren är registrerad
        const meetupParams = {
            TableName: 'Meetups',
            FilterExpression: 'contains(attendees, :userId)',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        };

        console.log('DynamoDB Scan Params:', JSON.stringify(meetupParams));

        // Hämtar användarens meetups från DynamoDB
        const meetupsData = await dynamoDB.scan(meetupParams).promise();

        console.log('DynamoDB Scan Result:', JSON.stringify(meetupsData));

        // Formaterar resultatet
        const meetups = meetupsData.Items.map((meetup) => ({
            id: meetup.id,
            title: meetup.title,
            description: meetup.description,
            date: meetup.scheduleDate,
            location: meetup.location,
        }));

        // Returnerar användarens profil och meetup-information
        return {
            statusCode: 200,
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                meetups: meetups,
                message: 'User profile fetched successfully',
            }),
        };
    } catch (error) {
        console.error('Error fetching profile:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal Server Error',
            }),
        };
    }
};
