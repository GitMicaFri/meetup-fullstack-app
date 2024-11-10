// getMeetupByKeyword.js
const dynamoDB = require('../db');

module.exports.handler = async (event) => {
    try {
        const keyword = event.queryStringParameters.keyword.toLowerCase();

        const params = { TableName: 'Meetups' };
        const result = await dynamoDB.scan(params).promise();

        const matchingMeetups = result.Items.filter(
            (meetup) =>
                meetup.title.toLowerCase().includes(keyword) ||
                meetup.description.toLowerCase().includes(keyword)
        );

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ meetups: matchingMeetups }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
