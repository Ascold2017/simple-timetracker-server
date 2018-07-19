const userEmitter = global.GLOBAL_EVENTS.userEmitter
const express = require('express')
const mongoose = require('mongoose')
const User = require('../../database').User

userEmitter.on('create', (ctx) => {

    console.log('Create User: ', ctx.req.body)

    const user = new User(ctx.req.body)
    user.save()
        .then(() => ctx.res.status(200).json({ message: 'User successfully created!' }))
        .catch(e => ctx.res.status(400).json({ message: e.message }))
})

userEmitter.on('remove', (ctx) => {
    
    console.log('Remove User: ', ctx.req.params.id)

    user.findByIdAndRemove(ctx.req.params.id)
        .then(() =>  ctx.res.status(200).json({ message: 'User successfully removed!' }))
        .catch(e => ctx.res.status(400).json({ message: e.message }))
})
