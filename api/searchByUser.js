module.exports = async (req, res) => {
	console.log('Incoming Request searchByUser');
	const {
		Employee
	} = require('../model/schema');

	const {
		firstName,
		lastName,
		employeeID
	} = req.body

	const data = {
		firstName: firstName,
		lastName: lastName,
		employeeID: employeeID
	}

	const schema = Joi.object({
		firstName: Joi.string().alphanum(),
		lastName: Joi.string().alphanum(),
		employeeID: Joi.string()
		.pattern(new RegExp('^[A-Z0-9]{3,30}$'))
	}).or('firstName', 'lastName', 'employeeID');

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
		console.log('err: ', err);

		return res.json({
			status: 'error',
			error: err
		}).status(500)
	}

	let whereObj = {};
	
	if (firstName) {
		whereObj.firstName = firstName;
	}
	
	if (lastName) {
		whereObj.lastName = lastName;
	}
	
	if (employeeID) {
		whereObj.employeeID = employeeID;
	}

	// console.log('whereObj: ', whereObj);

	const user = await Employee.find(whereObj).populate('userID').lean()

	console.log('user: ', user);

	if (!user) {
		return res.json({
			status: 'error',
			error: 'User Not Found'
		}).status(400)
	}

	let results = user.map(val => {
		let createObj = {
			firstName: val.firstName,
			lastName: val.lastName,
			employeeID: val.employeeID,
			organizationName: val.organizationName,
			email: val.userID && val.userID.email ? val.userID.email : null
		}
		return createObj;
	})
	// console.log('results: ', results);

	return res.json({
		results,
		status: 'success'
	}).status(200);;

}