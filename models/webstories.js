var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//webSchema
var webSchema = new Schema({
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
		default: 'OMGVoice'
	},
	time: Date,
	imageUrl: {
		type: String,
        required: true
	}
});

//Virtual
webSchema.virtual('TimeDifference').get(function() { 
	return Math.floor((Date.now() - this.time)/(60 * 60 * 1000));
});

webSchema.virtual('TimeDiffMins').get(function() { 
	return Math.floor((Date.now() - this.time)/(60 * 1000));
});

//Making values available as JSON and Objects
webSchema.set('toObject', { virtuals: true });
webSchema.set('toJSON', { virtuals: true });

var webstories = mongoose.model('webstory', webSchema);

module.exports = webstories;