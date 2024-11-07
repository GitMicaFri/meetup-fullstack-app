const dynamoDB = require('../db');

// Huvudfunktionen för att hämta information om en specifik meetup
module.exports.handler = async (event) => {
    console.log('Received event:', event); // Loggar inkommande event

    try {
        // Hämtar meetupId från path parameters i eventet
        const { meetupId } = event.pathParameters;

        // Definierar DynamoDB-parametrarna för att läsa meetup-informationen baserat på meetupId
        const params = {
            TableName: 'Meetups',
            Key: {
                id: meetupId, // Meetupens unika ID
            },
        };

        // Hämtar meetup-informationen från DynamoDB
        const result = await dynamoDB.get(params).promise();
        console.log('Meetup retrieved:', result);

        // Om meetup inte finns
        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Meetup not found' }),
            };
        }

        // Extraherar meetup-data
        const meetup = result.Item;

        // Räknar antalet registrerade deltagare
        const attendeeCount = meetup.attendees ? meetup.attendees.length : 0;
        const maxCapacity = 5; // Max antal platser

        // Returnerar meetup-detaljer till användaren
        return {
            statusCode: 200,
            body: JSON.stringify({
                description: meetup.description,
                date: meetup.scheduleDate,
                location: meetup.location,
                capacity: maxCapacity,
                registered: attendeeCount,
                availableSeats: maxCapacity - attendeeCount, // Platser som finns kvar
            }),
        };
    } catch (error) {
        console.error('Error:', error); // Loggar eventuella fel som uppstår

        // Returnerar ett felmeddelande vid serverfel
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
