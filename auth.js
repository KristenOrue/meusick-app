exports.handler = async (event) => {
    // Logging the event for debugging purposes
    console.log("event", JSON.stringify(event, null, 2));
    // Logging the event's headers authoirzation 
    console.log("event.headers['authorization']", event.headers["authorization"]);
    //Token ID comes from the authorization
    const tokenID = event.headers && event.headers["authorization"];
    // If you can't find the token ID then log that, and generate a Polocy (FUNCTION BELOW) with an object that's just allow false  
    if (!tokenID) {
        console.log("Could not find a token on the event");
        return generatePolicy({allow: false});
    }
    // Generate a policy. It's wrapped in a try catch becaue you are going to do be 
    //doing a lot more in this generaPolcy than just returning an object. 
    // You're going to be Checking if thi is a valid token through the firebase ADMIN SDK 
    // And saying is this actually a Valid Token for my app
    //Yes it is...Let it through
    // Or NO it's not so don't 
    try {
        return generatePolicy({ allow: true });
    } catch (error){
        console.log("error ", error);
        return generatePolicy({ allow: false });
    }
};
// An IAM POLICY we are returning a poloicy from this auth lambda which is acting as our Custom authorizer
// A serverless custom authorizater (API Gateway custom authorizer)
const generatePolicy = ({ allow }) => {
    return {
        principleId: "token",
        policyDocument: {
            Version: "2012-10-17",
            Statement: {
                Action: "execute-api:Invoke",
                //This is the ONLY PIECE OF LOGIC IN HERE! Either allow or deny
                Effect: allow ? "Allow" : "Deny",
                //For Evertyhing 
                //This also shouldnt be what you're actually policy document looks like
                //But for this demo you're gonna hae a resources of all the things 
                Resource: "*",
            },
        },
    };
};