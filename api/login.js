module.exports = async (req, res) => {
	console.log('Incoming Request::');
	const {
        User
	} = require('../model/schema');

	const {
		JWT_SECRET
	} = require('../constants.json');
	
	const {
		email,
		password
	} = req.body

	const data = {
		email: email,
		password: password
	}

	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string()
			.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
	});

	const {
		error,
		value
	} = schema.validate(data, {
		stripUnknown: true
	})

	console.log('value: ', value);

	if (error) {
		console.log('error101: ', JSON.stringify(error));

		const err = error && error.details && error.details[0] && error.details[0].message ? error.details[0].message : 'Something went wrong';

		return res.json({
			status: 'error',
			error: err
		}).status(500)
	}

	const user = await User.findOne({
		email
	}).lean()

	console.log('user: ', user);

	if (!user) {
		return res.json({
			status: 'error',
			error: 'Invalid email/password'
		}).status(400)
	}

	// * comparing the hash passwords
	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign({
				id: user._id,
				email: user.email
			},
			JWT_SECRET
		)

		return res.json({
			status: 'success',
			data: token
		}).status(200)
	}

	res.json({
		status: 'error',
		error: 'Invalid username/password'
	}).status(400)
}