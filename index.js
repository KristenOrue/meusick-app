const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');

var s3 = new AWS.S3({signatureVersion: 'v4', region:"us-west-2"});


const MUSIC_TABLE = process.env.MUSIC_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;
const QUEUE_URL = 'arn:aws:sqs:us-east-1:589772831734:SQSqueue';
const sqsClient = new AWS.SQS({region: 'us-east-1'});

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
  const auth = req.get("Authorization");
  const params = {
    TableName: 'music-table',
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
        "Genre": data,
        auth,
      });
    }
  });
})

app.get('/artists/for/genre/:genre', function (req, res) {
  const auth = req.get("authorization");
  const params = {
    TableName: 'music-table',
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
        "Artists": artists,
        auth,
      });
    }
  });
})
//albums BY Artist
app.get('/albums/for/artist/:artist', function (req, res) {
  const auth = req.get("authorization");
  const params = {
    TableName: 'music-table',
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
        "Albums": albums,
        auth,
      });
    }
  });
})

//Songs BY Album
app.get('/songs/for/album/:album', function (req, res) {
  const auth = req.get("authorization");
  const params = {
    TableName: 'music-table',
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
        "Songs": songs,
        auth,
      });
    }
  });
})

//Songs BY Album
app.get('/song/:song', function (req, res) {
  const auth = res.get("authorization");
  const params = {
    TableName: 'music-table',
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
        "Song": url,
        auth,
      });
    }
  });
})

//Create play endpoint
app.post('/play', function (req, res) {
  const params = {
    // TableName: MUSIC_TABLE,
    MessageBody: 
    JSON.stringify({
      artist: req.body.artist,
      album: req.body.album,
      song: req.body.song
    }),
    QueueUrl: QUEUE_URL
  };
  sqsClient.sendMessage(params, function(err, data) {
    if (err) {
      console.log("Failed", err); // an error occurred
    } else {
      res.send({
        "Success": true
      });
    }           // successful response
  });
})
// app.post('/play', function (req, res) {
//   if(!req.body.artist) {
//     return res.status(400).send({
//       success: 'false',
//       message: 'Artist param missing'
//     });
//   } else if(!req.body.album) {
//     return res.status(400).send({
//       success: 'false',
//       message: 'Album param missing'
//     });
//   } else if(!req.body.song) {
//     return res.status(400).send({
//       success: 'false',
//       message: 'Song param missing'
//     });
//   }
//  // const todo = {
//  //   id: db.length + 1,
//  //   title: req.body.title,
//  //   description: req.body.description
//  // }
//  // db.push(todo);
//  return res.status(201).send({
//    success: 'true',
//    message: 'Song happened. Hard.',
//    // todo
//  })
// })


//   dynamoDb.put(params, (error) => {
//     if (error) {
//       console.log(error);
//       res.status(400).json({ error: 'Could not create Genre' });
//     }
//     res.json({ genre, artist, album, song });
//   });
// })

module.exports.handler = serverless(app);