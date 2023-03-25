const mongoose = require('mongoose');

const leadsDataSchema = new mongoose.Schema({
	userId: String,
	leads: [{
        _id: string,
        firstName: string,
        lastName: string,
        company: string,
        position: string,
        message: string //(generated personalized message)
    }]

});

const leads = mongoose.model("leads", leadsDataSchema);

module.exports = leads;