var express = require('express');
var bodyParser = require('body-parser');
var GhStories = require('../models/ghstories');
var Verify = require('./verify');

var ghstoryRouter = express.Router();
ghstoryRouter.use(bodyParser.json());

ghstoryRouter.route('/')
.get(function(req, res, next) {
    GhStories.find(req.query)
        .sort({ time: -1 })
        .limit(8)
        .exec(function(err, ghstories) {
            if (err) next(err);

            res.json(ghstories);
        });
})
.post(Verify.verifyOrdinaryUser, function(req, res, next) {
    GhStories.create(req.body, function(err, ghstory) {
        if (err) next(err);
        
        ghstory.time = Date.now();
        ghstory.save(function(err, ghstory) {
            console.log('Ghana sports story sdded!');
            var id = ghstory._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added Ghana sports story with id: ' + id);
        });
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    GhStories.remove({}, function(err, resp) {
        if (err) next(err);

        res.json(resp);
    });
});

ghstoryRouter.route('/:ghstoryId')
.get(function(req, res, next) {
    GhStories.findById(req.params.ghstoryId, function(err, ghstory) {
        if (err) next(err);

        res.json(ghstory);
    });
})
.put(Verify.verifyOrdinaryUser, function(req, res, next) {
    GhStories.findByIdAndUpdate(req.params.ghstoryId, { $set: req.body }, { new: true }, 
        function(err, ghstory) {
            if (err) next(err);

            res.json(ghstory);
    });
})
.delete(Verify.verifyOrdinaryUser, function(req, res, next) {  
    GhStories.findByIdAndRemove(req.params.ghstoryId, function(err, resp) {
        if (err) next(err);

        res.json(resp);
    });
});

module.exports = ghstoryRouter;