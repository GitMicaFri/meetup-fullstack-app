// Importerar DynamoDB-instansen från db.js
const dynamoDB = require('../db');

// Huvudfunktionen för att registrera en användare till ett meetup-event
module.exports.handler = async (event) => {
    console.log('Received event:', event); // Loggar inkommande event

    try {
        // Tolkar inkommande JSON-data från anropet
        const data = JSON.parse(event.body);
        const { meetupId, userId } = data;

        // Kontroll för att säkerställa att både meetupId och userId är ifyllda
        if (!meetupId || !userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing required fields (meetupId and userId)',
                }),
            };
        }

        // Parametrar för att hämta meetup-information från DynamoDB
        const meetupParams = {
            TableName: 'Meetups',
            Key: { id: meetupId },
        };

        // Hämtar meetup-data från DynamoDB
        const meetupResult = await dynamoDB.get(meetupParams).promise();

        // Kontroll för att säkerställa att meetup finns
        if (!meetupResult.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Meetup not found' }),
            };
        }

        // Kontrollera om användaren redan är registrerad
        const attendees = meetupResult.Item.attendees || [];
        if (attendees.includes(userId)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'User already registered' }),
            };
        }

        // Försöker att lägga till användaren till meetup med villkoret att max 5 användare tillåts
        const updateParams = {
            TableName: 'Meetups',
            Key: { id: meetupId },
            UpdateExpression: 'SET attendees = list_append(attendees, :userId)',
            ConditionExpression: 'size(attendees) < :maxSize',
            ExpressionAttributeValues: {
                ':userId': [userId], // Användar-ID som ska läggas till i attendees-listan
                ':maxSize': 5, // Maximalt antal deltagare för ett meetup
            },
            ReturnValues: 'UPDATED_NEW', // Returnerar den uppdaterade listan av deltagare
        };

        // Försöker att uppdatera listan av deltagare för meetups
        await dynamoDB.update(updateParams).promise();

        // Om registreringen lyckas, returnera en framgångssvar
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'User registered for meetup successfully',
            }),
        };
    } catch (error) {
        // Kontroll för att se om felet beror på att meetup är fullt
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    message: 'Meetup is full. Registration not allowed.',
                }),
            };
        }

        console.error('Error:', error); // Loggar eventuella andra fel
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
