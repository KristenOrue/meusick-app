'use strict';
const express = require('serverless-express/express');
var app = express();

app.get('/ex', function (req, res) {
  //Use it (auth.js)
  //You can either check what this person actually looks like, 
  //How this person's authorization roles looks like from your app
  //You can do whatever you want with it
  //You can also pass through additional data within this request again going from the admin SDK for firebase
  //You just get it from the authorization (There are a ton of ways to do this):
  //rect.get is just an easy way to do it in express but you can do it in a ton of different ways 
  //To just get a head of authorization
  //Insomnia is the client I use for rest
  const auth = req.get("authorization");
  res.send({
    foo: 'bar',
    baz: 'bax',
    auth,
  });
});

const handler = require('serverless-express/handler');

module.exports.api = handler(app);

//Go to Insomnia (The client he uses for rest): 
//Now we have our execute api endpoint and go to our /dev/ex
//We send out the "Authorization" header of any token type this in under "New_Value" it can be spoons or test foo
//We send it and it goes through our auth 

//If we do not send it then we get a 401 unauthorized
//If we send with a bogus header like Auth and it's also not authorized 


//ONCE EXPRESS WAS ADDED NO LONGER USE THIS
// module.exports = {
//   hello: async (event) => {
//     return {
//       statusCode: 200,
//       body: JSON.stringify(
//         {
//           message: "Go Serverless v1.0! Your Function executed successfully!",
//           input: event,
//         },
//         null,
//         2,
//       ),
//     };
//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
//   },
// };

//SAME AS ABOVE 
// module.exports.hello = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };
  
//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
