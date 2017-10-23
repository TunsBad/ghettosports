var express = require('express');
var bodyParser = require('body-parser');
var Headlines = require('../models/headlines');
var Verify = require('./verify');

var headerRouter = express.Router();
headerRouter.use(bodyParser.json());

headerRouter.route('/')
.get(function(req, res, next) {
    Headlines.find(req.query, function(err, headerlines) {
        if (err) next(err);
        
        res.json(headerlines);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
	Headlines.create(req.body, function(err, headline) {
        if (err) next(err);
        
        headline.time = Date.now();
        headline.save(function(err, headline) {
            console.log("Headline successfully added to collection")
            var id = headline._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added headline with id: ' + id + ' to headline collection');
        });
	});
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Headlines.remove({}, function(err, resp) {
        if (err) next(err);

        res.json(resp);
    });
});

module.exports = headerRouter;