module.exports = function (req, res, next) {
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken() // метод появился после установки csrf / только для пост запросов
    next()
}