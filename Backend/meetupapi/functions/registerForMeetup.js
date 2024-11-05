// Importerar nödvändiga bibliotek och dynamoDB-instansen
const dynamoDB = require('../db');

// Huvudfunktionen för att registrera en användare till ett meetup-event
module.exports.handler = async (event) => {
    console.log('Received event:', event); // Loggar inkommande event

    try {
        // Tolkar inkommande JSON-data från anropet
        const data = JSON.parse(event.body);
        console.log('Parsed data:', data); // Loggar den tolkade datan

        // Kontroll för att säkerställa att obligatoriska fält är ifyllda
        if (!data.meetupId || !data.userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Meetup ID and User ID are required fields',
                }),
            };
        }

        // Parametrar för att uppdatera deltagarlistan i meetups-tabellen
        const params = {
            TableName: 'Meetups',
            Key: {
                id: data.meetupId,
            },
            UpdateExpression:
                'SET attendees = list_append(if_not_exists(attendees, :emptyList), :user)',
            ExpressionAttributeValues: {
                ':user': [data.userId],
                ':emptyList': [],
            },
            ReturnValues: 'UPDATED_NEW',
        };

        console.log('UpdateItem params:', params); // Loggar parametrarna för att uppdatera deltagarlistan

        // Uppdaterar meetup-data med ny deltagare i DynamoDB
        const result = await dynamoDB.update(params).promise();
        console.log('Update result:', result); // Loggar resultatet från DynamoDB

        // Bekräftar att registrering har lyckats
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User registered for meetup successfully',
                meetupId: data.meetupId,
                userId: data.userId,
            }),
        };
    } catch (error) {
        console.error('Error:', error); // Loggar eventuella fel som uppstår

        // Returnerar ett felmeddelande vid serverfel
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
            }),
        };
    }
};
