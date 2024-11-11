// registerForMeetup.js
const dynamoDB = require('../db');

module.exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const { meetupId, userId } = data;

        if (!meetupId || !userId) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Missing required fields (meetupId and userId)' }),
            };
        }

        const meetupParams = { TableName: 'Meetups', Key: { id: meetupId } };
        const meetupResult = await dynamoDB.get(meetupParams).promise();

        if (!meetupResult.Item) {
            return {
                statusCode: 404,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Meetup not found' }),
            };
        }

        const attendees = meetupResult.Item.attendees || [];
        if (attendees.includes(userId)) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: 'User already registered' }),
            };
        }

        const updateParams = {
            TableName: 'Meetups',
            Key: { id: meetupId },
            UpdateExpression: 'SET attendees = list_append(attendees, :userId)',
            ConditionExpression: 'size(attendees) < :maxSize',
            ExpressionAttributeValues: {
                ':userId': [userId],
                ':maxSize': 5,
            },
            ReturnValues: 'UPDATED_NEW',
        };

        await dynamoDB.update(updateParams).promise();

        return {
            statusCode: 201,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'User registered for meetup successfully' }),
        };
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 403,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: 'Meetup is full. Registration not allowed.' }),
            };
        }

        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
