const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: String,
    company: String,
    position: String,
    message: String
});

const lead = mongoose.model('lead', leadSchema);

module.exports = lead;