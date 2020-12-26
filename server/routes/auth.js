const {Router} = require('express')
const router = Router()


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: "Login",
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(()=>{ // для удаления всех сессий авторизации
        res.redirect('/auth/login#login')
    })
})

router.post('/login',  async (req, res) => {
    req.session.isAuthenticated = true
    res.redirect('/')
})
module.exports = router