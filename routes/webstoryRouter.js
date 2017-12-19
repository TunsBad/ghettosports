var express = require('express');
var bodyParser = require('body-parser');
var WebStories = require('../models/webstories');
var Verify = require('./verify');

var webstoryRouter = express.Router();
webstoryRouter.use(bodyParser.json());

webstoryRouter.route('/')
.get(function(req, res, next) {
    WebStories.find(req.query)
        .sort({ time: -1 })
        .limit(8)
        .exec(function(err, webstories) {
            if (err) next(err);

            res.json(webstories);
        });
})
.post(Verify.verifyOrdinaryUser, function(req, res, next) {
    WebStories.create(req.body, function(err, webstory) {
        if (err) next(err);
        
        webstory.time = Date.now();
        webstory.save(function(err, webstory) {
            console.log('Story from around the web added!');
            var id = webstory._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added Web story with id: ' + id);
        });
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    WebStories.remove({}, function(err, resp) {
        if (err) next(err);

        res.json(resp);
    });
});

webstoryRouter.route('/:webstoryId')
.get(function(req, res, next) {
    WebStories.findById(req.params.webstoryId, function(err, webstory) {
        if (err) next(err);

        res.json(webstory);
    });
})
.put(Verify.verifyOrdinaryUser, function(req, res, next) {
    WebStories.findByIdAndUpdate(req.params.webstoryId, { $set: req.body }, { new: true }, 
        function(err, webstory) {
            if (err) next(err);

            res.json(webstory);
    });
})
.delete(Verify.verifyOrdinaryUser, function(req, res, next) {  
    WebStories.findByIdAndRemove(req.params.webstoryId, function(err, resp) {
        if (err) next(err);

        res.json(resp);
    });
});

module.exports = webstoryRouter;