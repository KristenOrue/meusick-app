const AWS = require('aws-sdk');
const express = require('express');

const BUCKET_NAME = 'meusick-bucket';
const s3 = new AWS.S3();

module.exports.hello = (event, context, callback) => {
    const params = {
        Bucket: BUCKET_NAME
    };
    s3.listObjectsV2(params, (err, data) => {
        console.log('S3 List', data);

        let songs = []
        for (let item of data.Contents) {
            let url = s3.getSignedUrl('getObject', {
                Bucket: BUCKET_NAME,
                Key: item.Key,
            });
            songs.push(url);
        }
        let response = {
            "statusCode": 200,
            "headers": {
                "my_header": "my_value",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
        },
        "body": JSON.stringify(songs),
        "isBase64Encoded": false
    };
        callback(null, response);
    })
}


    // })
    // s3.getSignedUrlPromise('getObject', params);
    // promise.then(function(url) {
    //     console.log('The URL is', url);
    //     let response = {
    //         "statusCode": 200,
    //         "headers": {
    //             "my_header": "my_value",
    //             "Access-Control-Allow-Origin": "*",
    //             "Access-Control-Allow-Credentials": true,
    //         },
    //         "body": JSON.stringify(url),
    //         // "body": JSON.stringify(data.Contents, ['Key']),
    //         "isBase64Encoded": false
    //     };
    //     callback(null, response);
    // }, function(err) { callback(err, null); });



    // s3.listObjectsV2(params, function(err, data){
    //    if(err) {
    //        callback(err, null);
    //    } else {
    //        let response = {
    //     "statusCode": 200,
    //     "headers": {
    //         "my_header": "my_value",
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Credentials": true,
    //     },
    //     "body": JSON.stringify(data.Contents, ['Key']),
    //     "isBase64Encoded": false
        
    // };
    //        callback(null, response);
    // }
    // });


// const express = require('serverless-express/express');
// var app = express();
// const AWS = require('aws-sdk');
// // const express = require('express');

// const BUCKET = 'meusick-bucket';
// const s3 = new AWS.S3();

// app.get('/s3file', (req, res) => {
//     const params = {
//         Bucket: 'meusick-bucket'
//     };
//     s3.listObjectsV2(params, (err, data) => {
//      console.log('S3 List', data);

//      // Package signed URLs for each to send back to client
//      let songs = []
//      for (let item of data.Contents) {
//       let url = s3.getSignedUrl('getObject', {
//         Bucket: 'meusick-bucket',
//         Key: item.Key, 
//         Expires: 500 //time to expire in seconds - 5 min
//       });
//       songs.push(url);
//      }
//      res.send(songs);
//     })
//    });

// const handler = require('serverless-express/handler');

// module.exports.hello = handler(app);