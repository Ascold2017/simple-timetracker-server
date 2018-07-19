const name = 'Task'

const mongoose = require('mongoose')

let schema = mongoose.Schema({
	name: {
		type: String,
        required: true
    }
})

module.exports = {
	[name]: mongoose.model(name, schema)
}
