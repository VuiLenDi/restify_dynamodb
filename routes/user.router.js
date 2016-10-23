/**
 * Created by vuilendi on 10/23/2016.
 */

var Router = require('restify-router').Router;
var user_router = new  Router();

function send(req, res, next) {
    res.send('hello ' + req.params.name);
    return next();
}

user_router.post('/hello', function create(req, res, next) {
    res.send(201, Math.random().toString(36).substr(3, 8));
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