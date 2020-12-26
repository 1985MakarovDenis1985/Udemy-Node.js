
// --- мидлвер для закрытия пути в поисковой строке

module.exports = function (req, res, next){
    if (!req.session.isAuthenticated){
       return  res.redirect('/auth/login')
    }
    next()
}