const router = require('express').Router();
const AuthUser = require('../models/authUserModel');

router.post('/isUserAuthenticated', async (req, res) => {
	try {
		const { email } = req.body;

		if(!email)
			return res.status(400).json({
				error: 'Invalid email.'
			});
		
		const userAuthExists = await AuthUser.findOne({ email });
		if(!userAuthExists) {
			return res.json({
				authenticated: false
			});
		} else {
			return res.json({
				authenticated: true
			});
		}
		
	} catch(err) {
		console.error(err);
		res.status(500).send();
	}
});

module.exports = router;