const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');

var s3 = new AWS.S3({signatureVersion: 'v4', region:"us-west-2"});


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

app.get('/artists/for/genre/:genre', function (req, res) {
  const params = {
    TableName: 'music',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': "genre#" + req.params.genre,
      ':sk': "artist"
    },
  }
  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      artists = [];
      data.Items.forEach(function(item) {
        artists.push(item.info.artist);
      });
      res.send({
        "Artists": artists
      });
    }
  });
})
//albums BY Artist
app.get('/albums/for/artist/:artist', function (req, res) {
  const params = {
    TableName: 'music',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': "artist#" + req.params.artist,
      ':sk': "album"
    },
  }
  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      albums = [];
      data.Items.forEach(function(item) {
        albums.push(item.info.albums);
      });
      res.send({
        "Albums": albums
      });
    }
  });
})

//Songs BY Album
app.get('/songs/for/album/:album', function (req, res) {
  const params = {
    TableName: 'music',
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': "album#" + req.params.album,
      ':sk': "song"
    },
  }
  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      songs = [];
      data.Items.forEach(function(item) {
        songs.push(item.info.song);
      });
      res.send({
        "Songs": songs
      });
    }
  });
})

//Songs BY Album
app.get('/song/:song', function (req, res) {
  const params = {
    TableName: 'music',
    KeyConditionExpression: 'pk = :pk and sk = :sk',
    ExpressionAttributeValues: {
      ':pk': "song",
      ':sk': "song#" + req.params.song
    },
  }
  dynamoDb.query(params, function(err, data) {
     if (err) console.log(err);
     else {
      console.log(data);
      var params = {Bucket: 'meusick-bucket', Key: data.Items[0].info.song};
      var url = s3.getSignedUrl('getObject', params);
      res.send({
        "Song": url
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
app.post('/play', function (req, res) {
  const { genre, artist, album, song} = req.body;
  if (typeof genre!== 'string') {
    res.status(400).json({ error: '"Genre" must be a string' });
  } else if (typeof artist !== 'string') {
    res.status(400).json({ error: '"Artist" must be a string' });
  }

  const params = {
    TableName: MUSIC_TABLE,
    Item: {
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