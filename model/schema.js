const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		employeeID: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeSchema" }
	},
	{
		collection: 'users'
	}
);

const EmployeeSchema = new mongoose.Schema(
	{
		employeeID: { type: String, required: true, unique: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		organizationName: { type: String, required: true },
		userID: {type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" }
	},
	{
		collection: 'employees'
	}
);


module.exports = {
	 User: mongoose.model('UserSchema', UserSchema),
     Employee: mongoose.model('EmployeeSchema', EmployeeSchema)
}
