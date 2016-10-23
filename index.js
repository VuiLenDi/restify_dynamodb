var restify = require('restify');

var user_router = require('./routes/user.router'); // return a Router with only user route definitions

//var grade_type_router = require('./routes/gradetype.router');
var server = restify.createServer({});

// add user routes
user_router.applyRoutes(server);

// add grade_type routes
//grade_type_router.applyRoutes(server);

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});