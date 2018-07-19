const name = 'Company'

const mongoose = require('mongoose')

let schema = mongoose.Schema({
	name: {
		type: String,
        required: true,
        unique: true
    },

    admin_id: {
		type: String,
		required: true
    },
    
    users: [
        {
            user_id: {
                type: String
            },
        }
    ],
    
    tasks: [
        {
            task_id: {
                type: String
            },
        }
    ]
    
})

module.exports = {
	[name]: mongoose.model(name, schema)
}
