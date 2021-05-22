module.exports = async (req, res) => {
	console.log('Incoming Request getUserList');
	const { Employee
	} = require('../model/schema');
	const {
		page,
		limit,
		sortBy,
		orderBy
	} = req.body;

	const data = {
		page: page,
		limit: limit
	}

	const schema = Joi.object({
		page: Joi.number().required(),
		limit: Joi.number().required()
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

	// * Default Sorting Filter
	let field = 'employeeID';
	let criteria = 'ascending';

	// * Pagination Logic
	const startIndex = (page - 1) * limit
	const endIndex = page * limit

	const totalPages = await Employee.countDocuments().exec();
	const results = {};

	if (endIndex < totalPages) {
		results.next = {
			page: page + 1,
			limit: limit
		}
	}

	if (startIndex > 0) {
		results.previous = {
			page: page - 1,
			limit: limit
		}
	}

	// * Query MongoDb for Pagination & Sorting 
	try {
		if (sortBy) {
			field = sortBy;
		}
		if (orderBy) {
			criteria = orderBy;
		}

		const userList = await Employee.find().populate('userID').sort({
			[field]: criteria
		}).limit(limit).skip(startIndex).exec();
		// console.log('userList: ', userList);

		results.totalPages = Math.round(totalPages / limit);

		results.results = userList.map(val => {
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
	} catch (e) {
		console.log('Error:: ', e);
		res.status(500).json({
			status: 'error',
			error: e.message
		});
	}
}