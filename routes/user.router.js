/**
 * Created by vuilendi on 10/23/2016.
 */

var Router = require('restify-router').Router;
var user_router = new  Router();
var bunyan = require('bunyan');

function send(req, res, next) {

    res.json({
        username: req.params.name
    });
    //res.send('hello ' + req.params.name);
    return next();
}

function test_request(req, res, next) {
    res.send(req.params);
}

user_router.post('test_request', test_request);

user_router.post('/hello', function create(req, res, next) {
    /*res.json({
        result: Math.random().toString(36).substr(3, 8)
    });*/

    res.send({hello: req.params.username});

    return next();
});
user_router.put('/hello', send);
user_router.get('/hello/:name', send);
user_router.head('/hello/:name', send);
user_router.del('hello/:name', function rm(req, res, next) {
    res.send(204);
    return next();
});

module.exports = user_router;