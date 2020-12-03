const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')

const app = express()
// настраиваем движок
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
// регистрируем в express
app.engine('hbs', hbs.engine)
// использование
app.set('view engine', 'hbs')
// указания пути шаблонов
app.set('views', path.join(__dirname, 'views')) // второй параметр название папки с шаблонами

//// --- c использованием handlebars --- ////
app.get('/', (req, res, next) => {
    res.render('index')
})

app.get('/about',  (req, res, next) => {
    res.render('about')
})

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


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server on port:${3000} has been started...`)
})
