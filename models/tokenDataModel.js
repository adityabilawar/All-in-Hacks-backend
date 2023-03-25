const mongoose = require('mongoose');

const tokensSchema = new mongoose.Schema({
    user: String,
    expire: Number
});

const tokens = mongoose.model("leads", tokensSchema);

module.exports = tokens;