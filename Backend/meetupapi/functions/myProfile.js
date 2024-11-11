const dynamoDB = require('../db')

// Huvudfunktionen för att hämta en användarprofil och dess bokade meetups baserat på användarens userId
module.exports.handler = async (event) => {
    try {
        const userId = event.queryStringParameters.userId
        console.log('Fetching profile for userId:', userId)

        if (!userId) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*", // CORS-stöd
                },
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

        const profileData = await dynamoDB.get(profileParams).promise()

        if (!profileData.Item) {
            console.log('User not found:', userId)
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*", // CORS-stöd
                },
                body: JSON.stringify({
                    error: 'User not found',
                }),
            }
        }

        const { firstName, lastName, email } = profileData.Item

        // Parametrar för att söka efter meetups där användaren är registrerad som attendee
        const meetupParams = {
            TableName: 'Meetups',
            FilterExpression: 'contains(attendees, :userId)',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        };

        console.log('DynamoDB Scan Params:', JSON.stringify(meetupParams))
        const meetupsData = await dynamoDB.scan(meetupParams).promise()

        console.log('DynamoDB Scan Result:', JSON.stringify(meetupsData))

        const meetups = meetupsData.Items.map((meetup) => ({
            id: meetup.id,
            title: meetup.title,
            description: meetup.description,
            date: meetup.scheduleDate,
            location: meetup.location,
        }));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS-stöd
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                meetups: meetups,
                message: 'User profile and meetups fetched successfully',
            }),
        }
    } catch (error) {
        console.error('Error fetching profile:', error);

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // CORS-stöd
            },
            body: JSON.stringify({
                error: 'Internal Server Error',
            }),
        }
    }
}
