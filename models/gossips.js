var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gossipSchema = new Schema({
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	category: String,
	newsagency: String,
	link: String,
	caption: String,
	gossip: { 
		type: String,
        required: true
	}
}, { timestamps: true });

gossipSchema.index({ caption: 'text' });

var Gossips = mongoose.model("Gossip", gossipSchema);

module.exports = Gossips;