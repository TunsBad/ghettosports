var express = require('express');
var bodyParser = require('body-parser');
var Verify = require('./verify');

var Gossips = require('../models/gossips');

gossipRouter = express.Router();
gossipRouter.use(bodyParser.json());

gossipRouter.route('/')
.get(function(req, res, next) {
	Gossips.find(req.query)
	    .sort({ updatedAt: -1 })
	    .limit(10)
	    .exec(function(err, gossips) {
	   	    if (err) next(err);

	   	    res.json(gossips);
	   });
})
.post(Verify.verifyOrdinaryUser, function(req, res, next) {
	Gossips.create(req.body, function(err, gossip) {
        if (err) next(err);
        
        gossip.postedBy = req.decoded._id;
        gossip.save(function(err, gossip) {
            console.log("Gossip added to Collection")
            var id = gossip._id;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Added gossip with id: ' + id + ' to gossips collection');
        });
	});
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
	Gossips.remove({}, function(err, resp) {
		if (err) next(err);

		res.json(resp);
	});
});

gossipRouter.route('/:gossipId')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
	Gossips.findById(req.params.gossipId)
	    .exec(function(err, gossip) {
	    	if (err) next(err);

	    	res.json(gossip);
	    });
})
.put(Verify.verifyOrdinaryUser, function(req, res, next) {
	Gossips.findByIdAndUpdate(req.params.gossipId, { $set:req.body }, { new:true }, function(err, gossip) {
        if (err) next(err);

        res.json(gossip);
	});
})
.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
	Gossips.findByIdAndRemove(req.params.gossipId, function(err, resp) {
		if (err) next(err);

		res.json(resp);
	})
});

gossipRouter.route('/search/:query')
.get(function(req, res, next) {
	Gossips.find(
		{ $text : { $search : req.params.query } },
		{ score : { $meta: 'textScore' } })
	        .sort({ score: { $meta : 'textScore' } })
	        .limit(30)
	        .exec(function(err, gossips) {
	        	if (err) next(err);

	        	res.json(gossips);
	        });
});

module.exports = gossipRouter;