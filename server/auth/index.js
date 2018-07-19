const userEmitter = global.GLOBAL_EVENTS.userEmitter
const authEmitter = global.GLOBAL_EVENTS.authEmitter
const express = require('express')

authEmitter.on('register', (ctx) => {
    console.log('Register', ctx.req.body)
    let body = ctx.req.body
    body.password = 'sm password'
    userEmitter.emit('create', ctx)
})
