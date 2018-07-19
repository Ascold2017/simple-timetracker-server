const User = require('./User')
const Company = require('./Company')
const Task = require('./Task')

module.exports = {
	...User,
	...Company,
	...Task
}
