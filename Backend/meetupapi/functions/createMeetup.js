const dynamoDB = require('../db');
const { v4: uuidv4 } = require('uuid');

// Huvudfunktionen för att skapa ett meetup-event
module.exports.handler = async (event) => {
    console.log('Received event:', event); // Loggar inkommande event

    try {
        // Tolkar inkommande JSON-data från anropet
        const data = JSON.parse(event.body);
        console.log('Parsed data:', data); // Loggar den tolkade datan

        // Kontroll för att säkerställa att alla obligatoriska fält är ifyllda
        if (
            !data.title ||
            !data.description ||
            !data.scheduleDate ||
            !data.location ||
            data.attendees === undefined
        ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing required fields', // Felmeddelande om fält saknas
                }),
            };
        }

        // Genererar ett unikt ID för meetups
        const meetupId = uuidv4();

        // Definierar parametrarna för att lägga till meetup i DynamoDB
        const params = {
            TableName: 'Meetups',
            Item: {
                id: meetupId, // Lägger till `id` som det primära nyckelfältet
                title: data.title,
                description: data.description,
                scheduleDate: data.scheduleDate, // lägger till datum för meetup
                location: data.location,
                attendees: [], // Skapar en tom lista för deltagarna
            },
        };

        console.log('PutItem params:', params); // Loggar parametrarna för att sätta in objektet i DynamoDB

        // Sparar meetup i DynamoDB
        await dynamoDB.put(params).promise();

        // Bekräftar att meetup har skapats framgångsrikt
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Meetup created successfully',
                meetupId: meetupId,
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
