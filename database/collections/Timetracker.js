const name = 'Timetracker'

const mongoose = require('mongoose')

let schema = mongoose.Schema({
	task_id: {
		type: String,
        required: true
    },
    
    user_id: {
		type: String,
        required: true
    },

    date_start: {
        type: Date,
        required: true
    },

    date_end: {
		type: Date
	}
})

module.exports = {
	[name]: mongoose.model(name, schema)
}
