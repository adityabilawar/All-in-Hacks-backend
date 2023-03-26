const router = require('express').Router();
const User = require('../models/userModel');
const Token = require('../models/tokenDataModel');
const upload = (require('multer'))({ dest: 'tmp' });
const fs = require('fs');
const xlsx = require('xlsx');

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

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
const openai = new OpenAIApi(configuration);
const LETTER_TYPES = ['a linkedin invite message', 'an introduction email', '5 Coffee Chat Questions']

router.post('/upload', upload.any(), async (req, res) => {
	try {
		const path = req.files[0].path;
		const { name } = req.body;
		const workbook = xlsx.readFile(path);
		var sheet_name_list = workbook.SheetNames;
		const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
		const resultData = [];
		for(let i = 0; i < jsonData.length; i++) {
			const userName = jsonData[i].Name;
			const userPosition = jsonData[i].Position;
			const userCompany = jsonData[i].Company;

			// linkedin invite message
			const response1 = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: `
					Hi! Can you write me a 300 character linkedin invite message on behalf of ${name} to the ${userPosition} of the company ${userCompany} whos name is ${userName} explaining that you want to help provide value to their business.
				`,
				max_tokens: 3000,
				temperature: 0,
				top_p: 1.0,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
			});
			resultData.push({
				name: userName,
				position: userPosition,
				company: userCompany,
				res: response1.data.choices[0].text,
				type: 'Linkedin Invite'
			});

			// introduction email
			const response2 = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: `
						Write me a personlized introduction email to ${userName}, who has the ${userPosition} position at the company ${userCompany} on behalf of ${name} explaining that I want to help provide value to their business & request a phone call
					  `,
				max_tokens: 3000,
				temperature: 0,
				top_p: 1.0,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
			});
			resultData.push({
				name: userName,
				position: userPosition,
				company: userCompany,
				res: response2.data.choices[0].text,
				type: 'Intro Email'
			});

			// coffee chat questions
			const response3 = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: `Write me 5 coffee chat questions on behalf of ${name} to ask to ${userName} that has the ${userPosition} position at the company ${userCompany}.`,
				max_tokens: 3000,
				temperature: 0,
				top_p: 1.0,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
			});
			resultData.push({
				name: userName,
				position: userPosition,
				company: userCompany,
				res: response3.data.choices[0].text,
				type: 'Coffee Chat'
			});
		}
		console.log(resultData);
		res.status(200).json(resultData);
	} catch(err) {
		console.error(err);
		res.status(500).send(err);
	}
	fs.unlinkSync(req.files[0].path);
});

module.exports = router;