var express = require('express');
var bodyParser = require('body-parser');
var TopStories = require('../models/topstories');
var Verify = require('./verify');

var topstoryRouter = express.Router();
topstoryRouter.use(bodyParser.json());

topstoryRouter.route('/')
.get(function(req, res, next) {
    TopStories.find(req.query)
        .sort({ time: -1 })
        .exec(function(err, topstories) {
            if (err) next(err);

            res.json(topstories);
        });
})
.post(Verify.verifyOrdinaryUser, function(req, res, next) {
    TopStories.create(req.body, function(err, topstory) {
        if (err) next(err);
        
        topstory.time = Date.now();
        topstory.save(function(err, topstory) {
            console.log('Top Story Added!');
            var id = topstory._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added top story with id: ' + id);
        });
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    TopStories.remove({}, function(err, resp) {
        if (err) next(err);

        res.json(resp);
    });
});

topstoryRouter.route('/:topstoryId')
.get(function(req, res, next) {
    TopStories.findById(req.params.topstoryId, function(err, topstory) {
        if (err) next(err);

        res.json(topstory);
    });
})
.put(Verify.verifyOrdinaryUser, function(req, res, next) {
    TopStories.findByIdAndUpdate(req.params.topstoryId, { $set: req.body }, { new: true }, 
        function(err, topstory) {
            if (err) next(err);

            res.json(topstory);
    });
})
.delete(Verify.verifyOrdinaryUser, function(req, res, next) {  
    TopStories.findByIdAndRemove(req.params.topstoryId, function(err, resp) {
        if (err) next(err);

        res.json(resp);
    });
});

module.exports = topstoryRouter;