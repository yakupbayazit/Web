const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const generateDate = require('./helpers/generateDate').generateDate
const limit = require('./helpers/limit').limit
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const methodOverride = require('method-override')
const app = express()


mongoose.connect('mongodb://localhost/node_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const mongoStore = connectMongo(expressSession)
app.use(expressSession({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
}))

app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash
    next()
})




//midlleware...kullanımlarım
app.use(fileUpload())
app.use(express.static('public'))
app.use(methodOverride('_method'))


//helpers methodlarım için
const hbs = exphbs.create({
    helpers: {
        generateDate: generateDate,
        limit: limit
    }
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
    //Display link midlleware.... 
app.use((req, res, next) => {
    const { userId } = req.session
    if (userId) {
        res.locals = {
            displaylink: true
        }
    } else {
        res.locals = {
            displaylink: false
        }
    }
    next()
})


const main = require('./routes/main')
const posts = require('./routes/posts')
const users = require('./routes/users')
const admin = require('./routes/admin/index')


app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)
app.listen(4000)