# Antarctica_Code_Test

used Bootstrap for UI 

used atlas mongodb online NoSQL database cluster

used mongoose for managing mongoose collections users & employee 

  Have Join both the collections on _id

   created users collection with 
        {
            email: { type: String, required: true, unique: true },
		    password: { type: String, required: true }
        }
 
  & employee collection with 
        {
            employeeID: { type: Number, required: true, unique: true },
		    firstName: { type: String, required: true },
		    lastName: { type: String, required: true },
		    organizationName: { type: String, required: true },
		    UserID: {type: mongoose.Schema.Types.ObjectId, ref: "UserSchema", required: true }
        }

 used mongoose transaction in case something goes bad


used Joi validator to validate incoming data

used JWT for Authentication

deployed on heroku with auto deploy from git hub using web hook


