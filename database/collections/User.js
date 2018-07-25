const name = 'User'

const mongoose = require('mongoose')

let schema = mongoose.Schema({
	company_id: {
		type: String,
		required: true
	},
	
	username: {
		type: String,
		required: true
	},

	email: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},

	password: {
		type: String,
        required: true,
        trim: true,
	},

	type: {
		type: Number,
		required: true
	},

	createdAt: {
		type: Date,
		required: true
	}
})

module.exports = {
	[name]: mongoose.model(name, schema)
}