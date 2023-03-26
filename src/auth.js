const Token = require('./models/tokenDataModel');

export const isUserAuth = async(token) => {
	const userAuth = await Token.findOne({ _id: token });

	if(userAuth) {
		if((new Date()).getTime() > userAuth.expire) {
			await Token.deleteOne({ _id: token });
			return false;
		}
		return true;
	} else {
		return false;
	}
}