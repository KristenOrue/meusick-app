const AWS = require('aws-sdk');

var s3 = new AWS.S3();
module.exports.hello = (event, context, callback) => {
    const params = {
  "Bucket": 'meusick-bucket'
    };
    s3.listObjects(params, function(err, data){
       if(err) {
           callback(err, null);
       } else {
           let response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        "body": JSON.stringify(data.Contents, ['Key']),
        "isBase64Encoded": false
        
    };
           callback(null, response);
    }
    });
};

// app.use(bodyParser.json());

// app.get('/genres', function (req, res) {
//     const params = {
//         TableName : MUSIC_TABLE,
//         AttributesToGet: ['genre']
//     };