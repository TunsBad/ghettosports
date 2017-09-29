var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enquirySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
    subject: {
    	type: String,
    	required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Enquiries = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiries;