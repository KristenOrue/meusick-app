const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');


const MUSIC_TABLE = process.env.MUSIC_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

// app.use(bodyParser.json({ strict: false }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/genres', function (req, res) {
  const params = {
    TableName: 'music',
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': "genre"
    },
  }

  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      res.send({
        "Genre": data
      });
    }
  });
})


// Get Genre endpoint
// app.get('/genre/:genre', function (req, res) {
//   const params = {
//     TableName: MUSIC_TABLE,
//     Key: {
//       genre: req.params.genre,
//     },
//   }

//   dynamoDb.get(params, (error, result) => {
//     if (error) {
//       console.log(error);
//       res.status(400).json({ error: 'Could not get genre' });
//     }
//     if (result.Item) {
//       const {genre, artist, album, song} = result.Item;
//       res.json({ genre, artist, album, song });
//     } else {
//       res.status(404).json({ error: "Genre not found" });
//     }
//   });
// })

// Create genre endpoint
app.post('/genre', function (req, res) {
  const { genre, artist, album, song} = req.body;
  if (typeof genre!== 'string') {
    res.status(400).json({ error: '"Genre" must be a string' });
  } else if (typeof artist !== 'string') {
    res.status(400).json({ error: '"Artist" must be a string' });
  }

  const params = {
    TableName: MUSIC_TABLE,
    Item: {
      genre: genre,
      artist: artist,
      album: album,
      song: song
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create Genre' });
    }
    res.json({ genre, artist, album, song });
  });
})

module.exports.handler = serverless(app);