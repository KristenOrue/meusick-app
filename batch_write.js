var params = {
    RequestItems: { // A map of TableName to Put or Delete requests for that table
        music: [ // a list of Put or Delete requests for that table
            //Display a song for George Strait from album
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "album#george_strait",
                        sk: "song#song_2",
                        id: "s_def457",
                        type: "song",
                        attr: {
                            name: "song_2",
                            s3_key: "country/GeorgeStrait/song_1",
                            length: "1233",
                            rating: 1.3,
                            release_date: "timestamp",
                        }
                    },
                },
            },
            //Display a song for George Strait from album
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "album#george_strait",
                        sk: "song#song_1",
                        id: "s_def451",
                        type: "song",
                        attr: {
                            name: "song_1",
                            s3_key: "country/GeorgeStrait/song_1",
                            length: "123",
                            rating: 2.3,
                            release_date: "timestamp",
                        }
                    },
                },
            },
            // Display a song for George Strait by searching for artist
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "artist#george_strait",
                        sk: "song#song_1",
                        id: "s_def451",
                        type: "song",
                        attr: {
                            name: "song_1",
                            s3_key: "country/GeorgeStrait/song_1",
                            length: "123",
                            rating: 2.3,
                            release_date: "timestamp",
                        }
                    },
                },
            },
            // Display a song for George Strait by searching for artist
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "artist#george_strait",
                        sk: "song#song_2",
                        id: "s_def452",
                        type: "song",
                        attr: {
                            name: "song_2",
                            s3_key: "country/GeorgeStrait/song_2",
                            length: "12343",
                            rating: 1.3,
                            release_date: "timestamp",
                        }
                    },
                },
            },

            // Display an album for George Strait
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "artist#george_strait",
                        sk: "album#george_strait",
                        id: "a_def456",
                        type: "album",
                        attr: {
                            name: "George Strait",
                            top_songs: [1,2,3,4],
                            release_date: "timestamp",
                        }
                    },
                },
            },
            // Display an album in view
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "artist#fgl",
                        sk: "album#abc",
                        id: "a_def456",
                        type: "album",
                        attr: {
                            name: "Florida Georgia Line",
                            top_songs: [1,2,3,4],
                            release_date: "timestamp"
                        }
                    },
                },
            },
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "genre",
                        sk: "country",
                        id: "g_def456",
                        type: "genre",
                        attr: {
                            name: "country",
                        }
                    },
                },
            },
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "genre",
                        sk: "rap",
                        id: "g_abc123",
                        type: "genre",
                        attr: {
                            name: "rap"
                        }
                    },
                },
            },
            //Grab the genres that an artist is associated to (Could make an item like this or make a GSI)
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "artist:taylor_swift",
                        sk: "genre#pop",
                        id: "a_def456",
                        type: "artist",
                        attr: {
                            name: "Taylor Swift",
                            top_songs: [1,2,3,4,5,6,7],
                            top_albums: ['a','b','c','d'],
                            bio: "Country music is awful, but Taylor Swift has a couple good songs",
                        }
                    },
                },
            },
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "genre#country",
                        sk: "artist#fgl",
                        id: "a_def456",
                        type: "artist",
                        attr: {
                            name: "Florida Georgia Line",
                            top_songs: [1,2,3,4],
                            top_albums: ['a','b','c','d'],
                            bio: "Country music is awful, not George Strait sure does make it better and worst",
                        }
                    },
                },
            },
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "genre#country",
                        sk: "artist#george_strait",
                        id: "a_def456",
                        type: "artist",
                        attr: {
                            name: "George Strait",
                            top_songs: [1,2,3,4],
                            top_albums: ['a','b','c','d'],
                            bio: "Country music is awful, not George Strait sure does make it better and worst",
                        }
                    },
                },
            },
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "artist",
                        sk: "george_strait",
                        id: "a_def456",
                        type: "artist",
                        attr: {
                            name: "George Strait",
                            top_songs: [1,2,3,4],
                            top_albums: ['a','b','c','d'],
                            bio: "Country music is awful, not George Strait sure does make it better and worst",
                        }
                    },
                },
            },
            { // An example PutRequest
                PutRequest: {
                    Item: { // a map of attribute name to AttributeValue
                        // Your Hash key and your range key should be completely from the actual thing
                        pk: "artist",
                        sk: "fgl",
                        id: "a_def456",
                        type: "artist",
                        attr: {
                            name: "Florida Georgia Line",
                            top_songs: [1,2,3,4],
                            top_albums: ['a','b','c','d'],
                            bio: "Country music is awful, not George Strait sure does make it better and worst",
                        }
                    },
                },
            },
        ],
    },
};
docClient.batchWrite(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});