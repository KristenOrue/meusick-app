const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const { query, validationResult } = require('express-validator/check');


const BUCKET_NAME = 'meusick-bucket';
const MUSIC_TABLE = 'music';

const app = express();

function queryDynamoDb(params) {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

    return documentClient.query(params).promise();
}

function scanDynamoDb(params) {
    const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

    return documentClient.scan(params).promise();
}

function getSignedUrl(key) {
    const s3Client = new AWS.S3();
    const params = {
        Bucket: BUCKET_NAME,
        Key: key
    }

    return new Promise(function(resolve, reject) {
        s3Client.getSignedUrl('getObject', params, function (err, url) {
            if (err) {
                console.log(`An error occured fetching the URL: ${err}`);
                return reject(err);
            } else {
                console.log(`Retrieved URL: ${url}`);
                return resolve(url);
            }
        });
    });
}

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());



app.get('/song', [
    query('song', 'Missing song query parameter').exists({ checkFalsy: true })
],
(req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send(validationErrors.array());
    }

    const song = req.query.song;

    const params = {
        TableName : MUSIC_TABLE,
        FilterExpression: 'song = :song',
        ExpressionAttributeValues : { ':song' : song }
    };

    scanDynamoDb(params)
        .then(items => {
            if (items.Count < 1) {
                return res.status(404).send(`Song ${song} not found`);
            }
            return getSignedUrl(items.Items[0].s3Key);
        })
        .then(url => {
            return res.status(200).send({ url });
        })
        .catch(err => {
            return res.status(500).send(err);
        });
}
);

app.get('/songs/for/album', [
    query('album', 'Missing album query parameter').exists({ checkFalsy: true })
],
(req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send(validationErrors.array());
    }

    const album = req.query.album;

    const params = {
        TableName: MUSIC_TABLE,
        IndexName: 'albumSong',
        KeyConditionExpression: 'album = :album',
        ExpressionAttributeValues: {
            ':album': album
        }
    };

    queryDynamoDb(params)
        .then(items => {
            if (items.Count < 1) {
                return res.status(404).send(`No songs found for album ${album}`);
            }
            return res.status(200).send(_.uniq(_.map(items.Items, item => item.song)));
        })
        .catch(err => {
            return res.status(500).send(err);
        });
}
);