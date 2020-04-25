const express = require('express')
const router = express.Router()
const post = require('../models/post')
const Category = require('../models/Category')
const User = require('../models/user')
router.get('/index', (req, res) => {
    console.log(req.session)
    res.render('site/index');
})
router.get('/about', (req, res) => {
    res.render('site/about');
})
router.get('/blog', (req, res) => {
    post.find({}).populate({ path: 'author', model: User }).sort({ $natural: -1 }).then(posts => {
        res.render('site/blog', { posts: posts, })
    })
})
router.get('/contact', (req, res) => {
    res.render('site/contact')
})

module.exports = router