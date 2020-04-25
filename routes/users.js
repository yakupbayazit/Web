const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('site/register')
})
module.exports = router


router.post('/register', (req, res) => {
    User.create(req.body, (error, user) => {
        res.redirect('/index')
    })
})
module.exports = router

router.get('/login', (req, res) => {
    res.render('site/login')
})
router.post('/login', (req, res) => {
    const { email, password } = req.body
    User.findOne({ email }, (error, user) => {
        if (user) {
            if (user.password == password) {
                req.session.userId = user._id

                res.redirect('/index')
            } else {
                res.redirect('/users/login')
            }
        } else {
            res.redirect('/users/register')
        }
    })
})
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/index')
    })
})
module.exports = router