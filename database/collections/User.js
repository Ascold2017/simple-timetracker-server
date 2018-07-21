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
})

schema.methods.isValid = function () {
	return new Promise((resolve, reject) => {
		let valid = this.company_id
		console.log(this)
		resolve(this)
	})
}

module.exports = {
	[name]: mongoose.model(name, schema)
}