var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//gossips schema
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
		required: true,
        unique: true
	},
	imageUrl: String
}, { 
	timestamps: true 
});

// you can only have one full text searchable field per collection
gossipSchema.index({ caption: 'text' });

var Gossips = mongoose.model("Gossip", gossipSchema);

module.exports = Gossips;