const companyEmitter = global.GLOBAL_EVENTS.companyEmitter
const userEmitter = global.GLOBAL_EVENTS.userEmitter
const express = require('express')
const mongoose = require('mongoose')
const Company = require('../../database').Company
const User = require('../../database').User

companyEmitter.on('create', (ctx) => {

    console.log('Create company: ', ctx.req.body)

    const body = ctx.req.body
    /// ??????????????
    userEmitter.emit('create', {
        req: {
            body: {
     
            }
        },
        res: {}
    })

    // нужно создать админа и получить его айдишник - это будет auth_id

    const company = new Company({
       name: body.name,
       admin_id: body.auth_id,
       users: [
           {
               user_id:  body.auth_id
           }
       ],
       tasks: []
    })

    company.save()
        .then(() => ctx.res.status(200).json({ message: 'Company successfully created!' }))
        .catch(e => ctx.res.status(400).json({ message: e.message }))
    
})
