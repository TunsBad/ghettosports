var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gossipSchema = new Schema({
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	category: { 
		type: String,
		default: "Football" 
	},
	newsagency: { 
		type: String,
		required: true 
	},
	link: String,
	caption: { 
		type: String,
		required: true 
	},
	gossip: { 
		type: String,
        unique: true
	}
}, { 
	timestamps: true 
});

gossipSchema.index({ caption: 'text' });

var Gossips = mongoose.model("Gossip", gossipSchema);

module.exports = Gossips;