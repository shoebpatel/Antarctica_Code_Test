module.exports = async (req, res) => {
	console.log('Incoming Request::');
	const {
		User,
		Employee
	} = require('../model/schema');

	const {
		firstName,
		lastName,
		employeeID,
		organizationName,
		email,
		plainTextPassword
	} = req.body;

	const data = {
		firstName: firstName,
		lastName: lastName,
		employeeID: employeeID,
		organizationName: organizationName,
		email: email,
		plainTextPassword: plainTextPassword
	}

	const schema = Joi.object({
		firstName: Joi.string()
			.alphanum()
			.min(3)
			.max(30)
			.required(),
		lastName: Joi.string()
			.alphanum()
			.min(3)
			.max(30)
			.required(),
		employeeID: Joi.number()
			.min(3)
			.required(),
		organizationName: Joi.string()
			.min(3)
			.max(30)
			.required(),
		email: Joi.string().email().required(),
		plainTextPassword: Joi.string()
			.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
	});

	const {
		error
	} = schema.validate(data, {
		stripUnknown: true
	})

	if (error) {
		console.log('error101: ', JSON.stringify(error));

		const err = error && error.details && error.details[0] && error.details[0].message ? error.details[0].message : 'Something went wrong';

		return res.json({
			status: 'error',
			error: err
		}).status(500)
	}

	// * 2nd param is saltRounds
	const password = await bcrypt.hash(plainTextPassword, 10)

	const session = await User.startSession();

	try {
		session.startTransaction();

		const createUser = await User.create([{
			email,
			password
		}], {
			session
		});
		console.log('createUser: ', createUser);

		const registerEmployee = await Employee.create([{
			firstName,
			lastName,
			employeeID,
			organizationName,
			userID: (createUser && createUser[0] && createUser[0]._id) ? createUser[0]._id : null
		}], {
			session
		});
		console.log('registerEmployee: ', registerEmployee);

		const eID = (registerEmployee && registerEmployee[0] && registerEmployee[0]._id) ? registerEmployee[0]._id : null;

		await session.commitTransaction();
		session.endSession();

		await User.findByIdAndUpdate(createUser[0]._id, {
			"employeeID": eID
		});

		res.json({
			status: 'success'
		}).status(200)
	} catch (error) {
		console.log('error102: ', JSON.stringify(error));

		await session.abortTransaction();
		session.endSession();

		// * 11000 means duplicate key
		if (error && error.code === 11000) {
			if (_.has(error.keyPattern, 'email')) {
				return res.json({
					status: 'error',
					error: 'EmailID already in use'
				}).status(400)
			}
			if (_.has(error.keyPattern, 'employeeID')) {
				return res.json({
					status: 'error',
					error: 'EmployeeID already in use'
				}).status(400)
			}
		}
		return res.json({
			status: 'error',
			error: 'Something went wrong'
		}).status(500)
	}
}