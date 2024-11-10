// getMeetupInfoById.js
const dynamoDB = require('../db');

module.exports.handler = async (event) => {
    try {
        const { meetupId } = event.pathParameters;

        const params = { TableName: 'Meetups', Key: { id: meetupId } };
        const result = await dynamoDB.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Meetup not found' }),
            };
        }

        const meetup = result.Item;
        const attendeeCount = meetup.attendees ? meetup.attendees.length : 0;
        const maxCapacity = 5;

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                description: meetup.description,
                date: meetup.scheduleDate,
                location: meetup.location,
                capacity: maxCapacity,
                registered: attendeeCount,
                availableSeats: maxCapacity - attendeeCount,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
