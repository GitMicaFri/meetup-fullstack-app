const dynamoDB = require('../db');

// Huvudfunktionen för att hämta alla meetup-event
module.exports.handler = async () => {
    try {
        // Parametrar för att skanna hela tabellen "Meetups" i DynamoDB
        const params = {
            TableName: 'Meetups',
        };

        console.log('Scanning table:', params.TableName); // Loggar vilken tabell som skannas

        // Hämtar alla objekt från tabellen "Meetups"
        const result = await dynamoDB.scan(params).promise();

        console.log('Scan result:', result); // Loggar resultatet från DynamoDB

        // Returnerar meetups-data om det fanns några resultat
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Tillåter anrop från alla domäner
                "Access-Control-Allow-Credentials": true, // Om cookies eller autentisering används
            },
            body: JSON.stringify({
                meetups: result.Items || [], // Returnerar en tom lista om inga meetups hittades
                message: 'Meetups retrieved successfully',
            }),
        };
    } catch (error) {
        console.error('Error:', error); // Loggar eventuella fel som uppstår

        // Returnerar ett felmeddelande vid serverfel
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Tillåter anrop från alla domäner vid fel också
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
                error: error.message,
            }),
        };
    }
};
