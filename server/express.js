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
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')


const User = require('./models/user')  // --- экспорт Схемы ---

const app = express()

const hbs = exphbs.create({  // --- настраиваем движок ---
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars) // решает проблемы с доступом
})

app.engine('hbs', hbs.engine) // --- регистрируем движок hbs в express ---

app.set('view engine', 'hbs') // --- использование ---

app.set('views', path.join(__dirname, 'views')) // --- указания пути шаблонов --- // второй параметр название папки с шаблонами

app.use(async (req, res, next) => { // --- временно забираем юзера ---
    try {
        const user = await User.findById('5fdcb8825c58fffd616a1062')
        req.user = user
        next()
    }catch (err){
        console.log(err)
    }
})

app.use(express.static(path.join(__dirname, 'public'))) // --- регестрируем статические файлы (где будут хранится например css...) ---

app.use(express.urlencoded({extended: true}))

// --- регестрируем роуты с префиксами пути---
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/orders', ordersRoutes)
app.use('/cart', cartRoutes)




const PORT = process.env.PORT || 3000
async function start(){
    try { // подключаем базу через mongoose
        const url = "mongodb+srv://Denys:test@cluster0.h1cn6.mongodb.net/shop"
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        const candidate = User.findOne()   // проверяем есть ли user уже в базе

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
