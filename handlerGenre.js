const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const { query, validationResult } = require('express-validator/check');


const BUCKET_NAME = 'meusick-bucket';
const MUSIC_TABLE = 'music';
const SQS_QUEUE_URL = '';

const app = express();

function queryDynamoDb(params) {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

    return documentClient.query(params).promise();
}

function scanDynamoDb(params) {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

    return documentClient.scan(params).promise();
}

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());

app.get('/genres', function (req, res) {
    const params = {
        TableName : MUSIC_TABLE,
        AttributesToGet: ['genre']
    };

    scanDynamoDb(params)
        .then(items => {
            if (items.Count < 1) {
                return res.status(404).send('No genres found');
            }
            return res.status(200).send(_.uniq(_.map(items.Items, item => item.genre)));
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

app.get('/artists/for/genre', [
    query('genre', 'Missing genre query parameter').exists({ checkFalsy: true })
],
(req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send(validationErrors.array());
    }

    const genre = req.query.genre;

    const params = {
        TableName: MUSIC_TABLE,
        KeyConditionExpression: 'genre = :genre',
        ExpressionAttributeValues: {
            ':genre': genre            }
    };

    queryDynamoDb(params)
        .then(items => {
            if (items.Count < 1) {
                return res.status(404).send(`No artists found for genre ${genre}`);
            }
            return res.status(200).send(_.uniq(_.map(items.Items, item => item.artist)));
        })
        .catch(err => {
            return res.status(500).send(err);
        });
}
);
