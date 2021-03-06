const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session) // для автоматического сохраниния сессий в mongoDb
const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash') // для передачи ошибок (валидации) при редиректе
const keys = require('./keys')

// --- middleware ---
const varMiddleware = require('./middleware/variables') // миддлваре авторизации
const userMiddleware = require('./middleware/user') // миддлваре модели юзер для сессии
const errorHandler = require('./middleware/error') // 404 ошибка
const fileMiddleware = require('./middleware/file') // multer - конфиг для загрузки файлов

// --- экспортируем роуты ---
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')

const app = express()
const hbs = exphbs.create({  // --- настраиваем движок ---
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars), // решает проблемы с доступом
    helpers: require('./utils/hbs-helpers')
})
const store = new MongoStore({ // --- создаем базу в монгодб с сессиями
    collection: 'sessions', // -- change from key.secret
    uri: keys.MONGODB_URI
})


app.engine('hbs', hbs.engine) // --- регистрируем движок hbs в express ---
app.set('view engine', 'hbs') // --- использование ---
app.set('views', path.join(__dirname, 'views')) // --- указания пути шаблонов --- // второй параметр название папки с шаблонами


app.use(express.static(path.join(__dirname, 'public'))) // --- регестрируем статические файлы (где будут хранится например css...) ---
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({ // --- настраиваем сессию
    secret: keys.SESSION_SECRET,
    resave: false, // --- указывает, нужно ли пересохранять сессию в хранилище, если она не изменилась (по умолчанию false)
    saveUninitialized: false, // --- если true, то в хранилище будут попадать пустые сессии;
    store // --- передаем базу с сессиями в настройки сессии
}))
// подключаем перед csrf
app.use(fileMiddleware.single('avatar')) // 'avatar' - должен быть в input type='file'

app.use(csrf()) // --- мидл csrf защиты | проверяе наличие токена
app.use(flash()) // --- передача ошибок
app.use(varMiddleware)
app.use(userMiddleware)


// --- регестрируем роуты с префиксами пути---
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/orders', ordersRoutes)
app.use('/cart', cartRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorHandler) // подключать после роутов, иначе роуты будут не доступны


const PORT = process.env.PORT || 3000
async function start(){
    try { // подключаем базу через mongoose
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
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
