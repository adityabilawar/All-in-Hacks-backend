const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	users: [
		{
            _id: string,
            user: string,
            pass: string,
            leads: [string] //(list of IDs)
		}
	]
});

const users = mongoose.model("users", usersSchema);

module.exports = users;