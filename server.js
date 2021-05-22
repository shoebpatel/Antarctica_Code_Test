const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const app = express();
const _ = require("underscore");

// * global declaration
global.mongoose = mongoose;
global.bcrypt = bcrypt;
global.jwt = jwt;
global.Joi = Joi;
global._ = _;

const {
	JWT_SECRET,
	PORT
} = require('./constants.json');

const port = process.env.NODE_ENV || PORT;


mongoose.connect('mongodb+srv://shoeb:shoeb@cluster0.dqzaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	autoIndex: true,
});

app.use('/', express.static(path.join(__dirname, 'static')));
app.use(express.json());

function authorization() {
	return (req, res, next) => {

		console.log('req.headers:', req.headers.authorization);

		const token = req.headers.authorization;

		if (!token) {
			return res.json({
				status: 'error',
				error: 'Unauthorize'
			}).status(403)
		}

		try {
			const user = jwt.verify(token, JWT_SECRET);
			console.log('user: ', user);
		} catch (error) {
			console.log('Error:: ', error)
			return res.json({
				status: 'error',
				error: 'UnAuthorized'
			})
		}
		next()
	}
}

// * REST Api for registration
app.post('/api/register', require('./api/register'))

// * REST Api for login
app.post('/api/login', require('./api/login'))

// * REST Api for get all UserList by pagination & Sorting
app.post('/api/getUserList', authorization(), require('./api/getuserlist') )

// * REST Api for fetching User on Search criteria First Name, Last Name or EmployeeID
app.post('/api/searchByUser', authorization(), require('./api/searchByUser'))

app.listen(port, () => {
	console.log(`Server up at ${port}`);
})
