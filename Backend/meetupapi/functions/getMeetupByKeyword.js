// Importerar dynamoDB-instansen
const dynamoDB = require('../db');

// Huvudfunktionen för att hämta meetups baserat på ett sökord
module.exports.handler = async (event) => {
    console.log('Received event:', event); // Loggar inkommande event

    try {
        // Hämtar sökordet från queryStringParameters
        const keyword = event.queryStringParameters.keyword.toLowerCase();

        // Definierar DynamoDB Scan-parametrarna för att skanna hela tabellen "Meetups"
        const params = {
            TableName: 'Meetups',
        };

        // Hämtar alla meetups från DynamoDB-tabellen
        const result = await dynamoDB.scan(params).promise();
        console.log('Scan result:', result);

        // Filtrerar meetups där titeln eller beskrivningen innehåller sökordet
        const matchingMeetups = result.Items.filter(
            (meetup) =>
                meetup.title.toLowerCase().includes(keyword) ||
                meetup.description.toLowerCase().includes(keyword)
        );

        // Returnerar listan över matchande meetups
        return {
            statusCode: 200,
            body: JSON.stringify({
                meetups: matchingMeetups,
                message: `${matchingMeetups.length} meetups found`,
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
