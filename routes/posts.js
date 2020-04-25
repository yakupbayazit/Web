const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const path = require('path')
const User = require('../models/user')
router.get('/new', (req, res) => {
        if (req.session.userId) {
            return res.render('site/addpost')
        }
        res.redirect('/users/login')
    })
    //tekil post her bir post için
router.get('/:id', (req, res) => {
    Post.findById(req.params.id).populate({ path: 'author', model: User }).then(post => {
        Post.find({}).populate({ path: 'author', model: User }).sort({ $natural: -1 }).then(posts => {

            res.render('site/post', { post: post, posts: posts })
        })

    })
})
router.post('/test', (req, res) => {

    let post_image = req.files.post_image
    post_image.mv(path.resolve(__dirname, '../public/img/postimages', post_image.name))

    Post.create({
        ...req.body,
        post_image: '/img/postimages/' + post_image.name,
        author: req.session.userId
    }, )
    res.redirect('/blog')
})
module.exports = router