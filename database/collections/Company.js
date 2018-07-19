const name = 'Company'

const mongoose = require('mongoose')

let schema = mongoose.Schema({
	name: {
		type: String,
        required: true,
        unique: true
    }
})

module.exports = {
	[name]: mongoose.model(name, schema)
}
