# Antarctica_Code_Test

Libraries used:
1. express
2. mongoose
3. bcryptjs
4. jsonwebtoken
5. joi
6. underscore
7. Bootstrap


APIs:
 1. registration api
 2. login api
 3. getuserlist api
  - pagination & sorting logic is implemented in this API.
  - the api sorts the data on EmployeeID(default if user has not specified) then shares the paginated data(on basis of limit & page no. specified in request body)

 4. searchByUser api
  - search the user by FirstName, LastName, EmployeeID Or it can be the combination of all


Folder Structure:
1. api folder
2. model folder
  - consist schema definition of the users & employees collections

3. private folder
 - serves the private route getUserList.html which does requires authorization for access

4. static folder
 - serves the static routes index.html & login.html which does not requires authorization for access


Process Design Used:
- vanilla JavaScript for rendering & Bootstrap for UI creation

- atlas mongoDB online NoSQL database cluster for storing the data

- created 2 collections(users & employees) with references of ObjectId in both collection for joins

- mongoose ODM for connection & manipulation of documents

- mongoDB transactions, if in case something goes bad then the transaction will rollback this will ensure ACID (Implemented while creating the user)

- Joi validator to validate incoming data

- JWT(JSON web token) for Authorization on private routes
  - once the user logged-in the token is generated at backend and saved on user's browser(local storage)
    & on every subsequent request this token is send back to the server & verified.
    If the token is not valid or tempered the user will rerouted back to the login page (Implemented Authorization middleware in express).

- deployed on heroku, with auto deploy web hook on push from github to heroku


