const appEmitter = global.GLOBAL_EVENTS.appEmitter
const userEmitter = appEmitter.get('user')
const companyEmitter = appEmitter.get('company')
const jwt = require('jwt-simple')
const config = require('../../config')

const validPassword = (incomingPassword, password) => {
    return incomingPassword === password
}

module.exports = response => {
    console.log('Login')
    let body = response.data
    if (!body.email || !body.password) {
        return response.catch({ status: 400, result: 'Поля не заполнены!' })
    }
    userEmitter.emit('find', { email: body.email })
    .then(user => {
        if (user) {
            if (validPassword(user.password, body.password)) {

                const token = jwt.encode({
                    userId: user._id,
                    company_id: user.company_id,
                    type: user.type
                }, config.tokenKey)

                companyEmitter.emit('find', { _id: user.company_id })
                .then(company => {
                    response.reply({
                        status: 200,
                        result: {
                            token,
                            message: 'Success!',
                            profile: {
                                companyName: company.name,
                                username: user.username,
                                type: user.type
                            }
                            
                        }
                    })
                })

            } else {
                response.catch({ status: 400, result: 'Password incorrect' })
            }
        } else {
            response.catch({ status: 400, result: 'User not exist' })
        }
    })
    .catch(e => response.catch(e))
}