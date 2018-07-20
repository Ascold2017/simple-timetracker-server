const express = require('express')
const mongoose = require('mongoose')
const User = require('../../database').User
const Company = require('../../database').Company

module.exports = response => {
    User.find({ company_id: response.result.id })
        .then(user => response.reply(user))
        .catch(e => response.reply({ message: e.message }))
}