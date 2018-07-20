const express = require('express')
const mongoose = require('mongoose')
const User = require('../../database').User
const Company = require('../../database').Company

module.exports = response => {
    Company.findById(response.result.company_id)
    .then(() => {

        const newUser = new User({
            company_id: response.result.company_id,
            username: response.result.username,
            email: response.result.email,
            password: response.result.password,
            type: response.result.type
        })

        return newUser.save()
            .then(() => response.reply({ message: 'User successfully created!' }))
            .catch(e => response.reply({ message: e.message }))
    })
    .catch(e => response.reply({ message: e.message }))
}