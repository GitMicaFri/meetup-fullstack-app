// createMeetup.js
const dynamoDB = require('../db');
const { v4: uuidv4 } = require('uuid');

module.exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);

        if (!data.title || !data.description || !data.scheduleDate || !data.location) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Missing required fields' }),
            };
        }

        const meetupId = uuidv4();
        const params = {
            TableName: 'Meetups',
            Item: {
                id: meetupId,
                title: data.title,
                description: data.description,
                scheduleDate: data.scheduleDate,
                location: data.location,
                attendees: [],
            },
        };

        await dynamoDB.put(params).promise();

        return {
            statusCode: 201,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'Meetup created successfully', meetupId }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
