var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var headlineSchema = new Schema({
    header: {
    	type: String,
    	required: true
    },
    time: Date
});

//Virtual
headlineSchema.virtual('TimeDifference').get(function() { 
	return (Date.now() - this.time);
});

//Making values available as JSON and Objects
headlineSchema.set('toObject', { virtuals: true });
headlineSchema.set('toJSON', { virtuals: true });

var headlines = mongoose.model('headline', headlineSchema);

module.exports = headlines;