const dynamoDB = require('../db');

module.exports.handler = async (event) => {
    console.log("Event received:", event);

    try {
        const { meetupId, userId } = JSON.parse(event.body);
        console.log("Parsed body:", { meetupId, userId });

        if (!meetupId || !userId) {
            console.log("Missing meetupId or userId");
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Missing meetupId or userId' }),
            };
        }

        const getParams = { TableName: 'Meetups', Key: { id: meetupId } };
        const result = await dynamoDB.get(getParams).promise();
        console.log("Get result:", result);

        if (!result.Item) {
            console.log("Meetup not found");
            return {
                statusCode: 404,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'Meetup not found' }),
            };
        }

        const attendees = result.Item.attendees || [];
        console.log("Current attendees:", attendees);

        if (!attendees.includes(userId)) {
            console.log("User not registered for this meetup");
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: 'User is not registered for this meetup' }),
            };
        }

        const updatedAttendees = attendees.filter((id) => id !== userId);
        console.log("Updated attendees:", updatedAttendees);

        const updateParams = {
            TableName: 'Meetups',
            Key: { id: meetupId },
            UpdateExpression: 'SET attendees = :attendees',
            ExpressionAttributeValues: { ':attendees': updatedAttendees },
        };

        await dynamoDB.update(updateParams).promise();
        console.log("Update successful");

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'User unregistered from meetup successfully' }),
        };
    } catch (error) {
        console.error("Error in cancellation function:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
