var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enquirySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    phone: String,
    subject: {
    	type: String,
    	required: true
    },
    comment: {
        type: String
    }
}, {
    timestamps: true
});

var Enquiries = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiries;