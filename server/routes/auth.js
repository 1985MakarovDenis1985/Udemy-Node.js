const {Router} = require('express')
const router = Router()
const User = require('../models/user')


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: "Login",
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => { // для удаления всех сессий авторизации
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findById('5fdcb8825c58fffd616a1062')
    req.session.user = user
    req.session.isAuthenticated = true
    req.session.save(err => { // fun для сохранения данных перед переходом
        if (err){
            throw err
        } else {
            res.redirect('/')
        }
    })
})
module.exports = router