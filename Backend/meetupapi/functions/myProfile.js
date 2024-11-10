// myProfile.js
const dynamoDB = require('../db');

module.exports.handler = async (event) => {
    try {
        const userId = event.queryStringParameters.userId;

        if (!userId) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Missing userId' }),
            };
        }

        const profileParams = { TableName: 'Meetup-Users', Key: { userId: userId } };
        const profileData = await dynamoDB.get(profileParams).promise();

        if (!profileData.Item) {
            return {
                statusCode: 404,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'User not found' }),
            };
        }

        const firstName = profileData.Item.firstName;
        const lastName = profileData.Item.lastName;

        const meetupParams = {
            TableName: 'Meetups',
            FilterExpression: 'contains(attendees, :userId)',
            ExpressionAttributeValues: { ':userId': userId },
        };

        const meetupsData = await dynamoDB.scan(meetupParams).promise();

        const meetups = meetupsData.Items.map((meetup) => ({
            id: meetup.id,
            title: meetup.title,
            description: meetup.description,
            date: meetup.scheduleDate,
            location: meetup.location,
        }));

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                meetups: meetups,
                message: 'User profile fetched successfully',
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
