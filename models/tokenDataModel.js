const mongoose = require('mongoose');

const tokensSchema = new mongoose.Schema({
	userId: String,
	tokens: [{
        _id: string,
        user: string,
        expire: timenumber //(time as a number)
    }]

});

const tokens = mongoose.model("leads", tokensSchema);

module.exports = tokens;