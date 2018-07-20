const express = require('express')
const mongoose = require('mongoose')
const User = require('../../database').User
const Company = require('../../database').Company

module.exports = response => {
    User.find({ company_id: response.result.id }, { password: 0, company_id: 0 })
        .then(users => response.reply(users))
        .catch(e => response.reply({ message: e.message }))
}