const User = require('./User')
const Company = require('./Company')
const Task = require('./Task')
const Timetracker = require('./Timetracker')

module.exports = {
	...User,
	...Company,
	...Task,
	...Timetracker
}
