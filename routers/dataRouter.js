const router = require('express').Router();
const User = require('../models/userModel');
const Token = require('../models/tokenDataModel');

router.post('/login', async (req, res) => {
	try {
		const { user, pass } = req.body;
		const userExists = await User.findOne({ user });

		if(userExists) {

			if(userExists.pass === pass) {
				const generatedToken = (Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)).substring(0, 20);

				const expireTime = new Date();
				expireTime.setTime(expireTime.getTime() + 2*3600000);
				const newTokenData = new Token({
					user,
					expire: expireTime.getTime()
				});
				await newTokenData.save();

				return res.json({ token: generatedToken });
			}

			return res.status(400).json({
				error: 'Incorrect password'
			});
		}

		else {
			const generatedToken = (Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)).substring(0, 20);
			const expireTime = new Date();
			expireTime.setTime(expireTime.getTime() + 2*3600000);
			const newTokenData = new Token({
				user,
				expire: expireTime.getTime()
			});
			await newTokenData.save();

			const newUserData = new User({
				user,
				pass,
				leads: []
			});
			await newUserData.save();

			return res.json({ token: generatedToken });
		}

	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});