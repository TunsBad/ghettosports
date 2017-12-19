var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//top stories schema
var topSchema = new Schema({
	title: {
	    type: String,
	    required: true
	},
	link: {
	    type: String,
	    required: true
	},
	category: { 
		type: String,
		default: 'Football'
	},
	time: Date,
	imageUrl: {
		type: String,
        required: true
	}
});

//Virtual
topSchema.virtual('TimeDifference').get(function() { 
	return Math.floor((Date.now() - this.time)/(60 * 60 * 1000));
});

topSchema.virtual('TimeDiffMins').get(function() { 
	return Math.floor((Date.now() - this.time)/(60 * 1000));
});

//Making values available as JSON and Objects
topSchema.set('toObject', { virtuals: true });
topSchema.set('toJSON', { virtuals: true });

var topstories = mongoose.model('topstory', topSchema);

module.exports = topstories;