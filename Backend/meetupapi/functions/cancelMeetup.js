// cancelMeetup.js
const dynamoDB = require('../db');

module.exports.handler = async (event) => {
    try {
        const { meetupId, userId } = JSON.parse(event.body);

        if (!meetupId || !userId) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Missing meetupId or userId' }),
            };
        }

        const getParams = { TableName: 'Meetups', Key: { id: meetupId } };
        const result = await dynamoDB.get(getParams).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Meetup not found' }),
            };
        }

        const attendees = result.Item.attendees || [];
        if (!attendees.includes(userId)) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'User is not registered for this meetup' }),
            };
        }

        const updatedAttendees = attendees.filter((id) => id !== userId);
        const updateParams = {
            TableName: 'Meetups',
            Key: { id: meetupId },
            UpdateExpression: 'SET attendees = :attendees',
            ExpressionAttributeValues: { ':attendees': updatedAttendees },
        };

        await dynamoDB.update(updateParams).promise();

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'User unregistered from meetup successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
