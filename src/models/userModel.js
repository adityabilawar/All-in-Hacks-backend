const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	user: String,
	pass: String,
	leads: [ String ]
});

const user = mongoose.model("users", userSchema);

module.exports = user;