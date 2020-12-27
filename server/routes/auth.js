const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs') // шифрование пароля
const User = require('../models/user')


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: "Login",
        isLogin: true,
        registrError: req.flash('registrError'), // --- передаем в рендер ошибку которую сформировали с низу в пост запросах
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

router.post('/registration', async (req, res) => {
    try {
        const {name, email, password, repeat} = req.body
        const candidate = await User.findOne({email})

        if (candidate) { // --- проверяем: существует ли уже такой кандидат в базе
            req.flash('registrError', 'user has already exist') // --- 1) название ошибки, 2) текст ошибки
            res.redirect('/auth/login#registration')
        } else {                                                // await - всегда перед асинхронными функциями
            const hasPassword = await bcrypt.hash(password, 10) // 1- что шифруем, 2- уровень шифрования
            const user = new User({
                name,
                email,
                password: hasPassword,
                cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
        }

    } catch (err) {
        console.log(err)
    }
})

module.exports = router