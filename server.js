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

const port = process.env.PORT || PORT;

try {
	mongoose.connect('mongodb+srv://shoeb:shoeb@cluster0.dqzaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		autoIndex: true,
	});
} catch (err) {
	console.log("err:3232:", err);
}


app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'static')));
app.use('/private', express.static(path.join(__dirname, 'private')));

function authorization() {
	return (req, res, next) => {

		console.log('req.headers:', req.headers.authorization);

		const token = req.headers.authorization;

		if (!token) {
			return res.status(302).redirect("/login.html");
		}
		try {
			const user = jwt.verify(token, JWT_SECRET);
			console.log('user: ', user);
		} catch (error) {
			console.log('Error:: ', error)
			return res.status(302).redirect("/login.html");
		}
		next()
	}
}

app.all('/private/*', authorization(), function(req, res, next) {
	console.log('Accessed::');
	  next(); // allow the next route to run
})
  
// * REST Api for registration
app.post('/api/register', require('./api/register'))

// * REST Api for login
app.post('/api/login', require('./api/login'))

// * REST Api for get all UserList by pagination & Sorting
app.post('/private/api/getUserList', require('./api/getuserlist') )

// * REST Api for fetching User on Search criteria First Name, Last Name or EmployeeID
app.post('/private/api/searchByUser', require('./api/searchByUser'))

app.listen(port, () => {
	console.log(`Server up at ${port}`);
})
