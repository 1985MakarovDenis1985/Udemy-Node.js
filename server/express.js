const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const mongoose = require('mongoose')

// --- экспортируем роуты ---
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cardRoutes = require('./routes/cart')

// --- экспорт Схемы ---
const User = require('./models/user')

const app = express()

// --- настраиваем движок ---
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars) // решает проблемы с доступом
})

// --- регистрируем движок hbs в express ---
app.engine('hbs', hbs.engine)

// --- использование ---
app.set('view engine', 'hbs')

// --- указания пути шаблонов ---
app.set('views', path.join(__dirname, 'views')) // второй параметр название папки с шаблонами

// --- временно забираем юзера ---
app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5fdcb8825c58fffd616a1062')
        req.user = user
        next()
    }catch (err){
        console.log(err)
    }
})

// --- регестрируем статические файлы (где будут хранится например css...) ---
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended: true}))

// --- регестрируем роуты с префиксами пути---
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/card', cardRoutes)



const PORT = process.env.PORT || 3000
async function start(){
// подключаем базу через mongoose
    try {
        const url = "mongodb+srv://Denys:test@cluster0.h1cn6.mongodb.net/shop"
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        // проверяем есть ли user уже в базе
        const candidate = User.findOne()

        if (!candidate){
            const user = new User({
                name: 'Denys',
                email: 'mda@gmail.com',
                card: {items:[]}
            })
            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`server on port:${3000} has been started...`)
        })
    }catch (err){
        console.log(err)
    }
}
start()







// //// --- lesson before registreted routes
// //// --- c использованием handlebars --- ////
// app.get('/', (req, res, next) => {
//     res.render('index', {
//         title: 'Home Page',
//         isHome: true
//     })
// })
//
// app.get('/courses',  (req, res, next) => {
//     res.render('courses', {
//         title: "Courses",
//         isCourses: true
//     })
// })
//
// app.get('/add',  (req, res, next) => {
//     res.render('add', {
//         title: "Add Course",
//         isAdd: true
//     })
// })
//// --- без использования handlebars --- ////
// app.get('/', (req, res, next) => {
//     res.status(200)
//     res.sendFile(path.join(__dirname, 'html', 'index.views'))
// })
//
// app.get('/about',  (req, res, next) => {
//     res.status(200)
//     res.sendFile(path.join(__dirname, 'html', 'about.views'))
// })
// const PORT = process.env.PORT || 3000
//
// app.listen(PORT, () => {
//     console.log(`server on port:${3000} has been started...`)
// })
