const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs') // шифрование пароля
const crypto = require('crypto') // для генерации рандомных ключей
const User = require('../models/user')
const keys = require('../keys')
// const {query, params или check} = require('express-validator/check') // --- check - если хотим проверить все параметры || query - если хотим проверить query параметры
const {validationResult} = require('express-validator') // --- body - если хотим проверить тело запроса || validationResult - получаем ошибки которые присутствуют
const {registrationValidator} = require('../utils/validators')
const nodemailer = require('nodemailer') // реализация отправки писем
const sendgrid = require('nodemailer-sendgrid-transport') // реализация отправки писем
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')

// --- создаем trp и передаем в него сервис которым пользуемся --- //
const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY} // --- очень важно передать api_key
}))


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: "Login",
        isLogin: true,
        registrationError: req.flash('registrationError'), // --- передаем в рендер ошибку которую сформировали с низу в пост запросах
        loginError: req.flash('loginError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => { // для удаления всех сессий авторизации
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password) // bcrypt сравнивает пароли
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => { // fun для сохранения данных перед переходом
                    if (err) {
                        throw err
                    } else {
                        res.redirect('/')
                    }
                })
            } else {
                req.flash('loginError', 'user has not found')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'user has not found')
            res.redirect('/auth/login#login')
        }
    } catch (err) {
        console.log(err)
    }
})

// --- вынесли валидатор отдельно --- //
router.post('/registration', registrationValidator, async (req, res) => {
    try {
        const {name, email, password} = req.body

        const errors = validationResult(req) // --- проверяем на ошибки --- //
        if (!errors.isEmpty()) { // --- isEmpty = ошибок нет --- //
            req.flash('registrationError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#registration')
        }

                                              // await - всегда перед асинхронными функциями
            const hasPassword = await bcrypt.hash(password, 10) // 1- что шифруем, 2- уровень шифрования
            const user = new User({
                name,
                email,
                password: hasPassword,
                cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')

            // --- рекомендуется использовать после редиректов, что бы не грузить страницу сервисами с долгими загрузками --- //
            await transporter.sendMail(
                // --- конфиг с выносом в отдельный конфиг --- //
                regEmail(email, name)

                // --- конфиг без создания отдельного конфига --- //
                // {         // --- оправляем имейл пользователю после регистрации --- //
                //     to: email,
                //     from: "study-node@gmail.com",
                //     subject: "registration was successful", // --- тема письма --- //
                //     html: '' // --- отправка данных в виде html --- //
                // }
            )

    } catch (err) {
        console.log(err)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot the password',
        error: req.flash('error')
    })
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()} // gt/lt gr-grater - выче чем текущая дата
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Recover access',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }

    } catch (err) {
        console.log(err)
    }
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something wrong, try later')
                res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex') // --- получаем какой-то сгенерируемый токен --- //
            const candidate = await User.findOne({email: req.body.email}) // --- проверяем есть ли вообще такой пользователь в базе --- //

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000 // --- задаем время токену --- //
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'There is no user with this email')
                res.redirect('/auth/reset')
            }

        })
    } catch (err) {
        console.log(err)
    }
})

router.post('/password', async (req, res) => {
    try {

        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')


        } else {
            req.flash('loginError', 'time of token is up')
            res.redirect('/auth/login')
        }

    } catch (err) {
        console.log(err)
    }
})

module.exports = router