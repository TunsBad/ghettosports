var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ghSchema = new Schema({
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
	time: Date
});

//Virtual
ghSchema.virtual('TimeDifference').get(function() { 
	return Math.floor((Date.now() - this.time)/(60 * 60 * 1000));
});

//Making values available as JSON and Objects
ghSchema.set('toObject', { virtuals: true });
ghSchema.set('toJSON', { virtuals: true });

var ghstories = mongoose.model('ghstory', ghSchema);

module.exports = ghstories;