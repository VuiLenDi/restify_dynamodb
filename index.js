var restify = require('restify');
var config = require('config');

var user_router = require('./routes/user.router'); // return a Router with only user route definitions
var bunyan = require('bunyan');

var dbConfig = config.get('dbConfig');

var AWS = require("aws-sdk");
AWS.config.update(dbConfig);

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

function createTables()
{
    var params = {
        TableName : "Movies",
        KeySchema: [
            { AttributeName: "year", KeyType: "HASH"}, //Partition key
            { AttributeName: "title", KeyType: "RANGE" } //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "year", AttributeType: "N" },
            { AttributeName: "title", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };
    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:",
                JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:",
                JSON.stringify(data, null, 2));
        }
    });
}

function insertMovie()
{
    var params = {
        RequestItems: {
            "Movies": [{
                PutRequest: {
                    Item: {
                        "title": "No One You Know",
                        "year": 2016,
                        "Price": 1.98,
                        "Genre": "Honor"
                    }
                }
            }, {
                PutRequest: {
                    Item: {
                        "title": "No One You Know 2",
                        "year": 2016,
                        "Price": 1.98,
                        "Genre": "Drama"
                    }
                }
            }, {
                PutRequest: {
                    Item: {
                        "title": "The Acme Band",
                        "Price": 2.47,
                        "year": 1995,
                        "Genre": "Fiction",
                        "PromotionInfo": {
                            "RadioStationsPlaying": [
                                "KHCR", "KBQX", "WTNR", "WJJH"
                            ],
                            "TourDates": {
                                "Seattle": "20150625",
                                "Cleveland": "20150630"
                            },
                            "Rotation": "Heavy"
                        }
                    }
                }
            }]
        }
    };
    docClient.batchWrite(params, function(err, data) {
        if (err)
            console.log(JSON.stringify(err, null, 2));
        else
            console.log(JSON.stringify(data, null, 2));
    });
}

function listTables()
{
    var params = {};

    dynamodb.listTables(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:",
                JSON.stringify(err, null, 2));
        } else {
            console.log("All tables were created. Table description JSON:",
                JSON.stringify(data, null, 2));
        }
    });
}

insertMovie();



//var grade_type_router = require('./routes/gradetype.router');
var server = restify.createServer({
    /*certificate: fs.readFileSync('path/to/server/certificate'),
    key: fs.readFileSync('path/to/server/key'),*/
    name: 'Restify API Server',
    version: '1.0.0'
});

/** BUNDLE Plugins **/
// Accept Parser
server.use(restify.acceptParser(server.acceptable));

// CORS
server.use(restify.CORS({
    origins: ['*'/*'https://foo.com', 'http://bar.com', 'http://baz.com:8081'*/],   // defaults to ['*']
    credentials: true                 // defaults to false
}));

// Body Parser
server.use(restify.bodyParser());


/** ROUTERS **/
// add user routes
user_router.applyRoutes(server, '');


// Use audit log, we just open it for testing
/*
server.on('after', restify.auditLogger({
    log: bunyan.createLogger({
        name: 'Rest API Log',
        stream: process.stdout
    })
}));
*/

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});

