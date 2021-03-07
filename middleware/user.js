const User = require('../models/user')

module.exports = async function (req, res, next){
    if (!req.session.user){
        return next()
    }
    // --- присваиваеи req.user = юзера из сессии и обарачиваем в Schema --- так как в сессии модели Schema не используется
    req.user = await User.findById(req.session.user._id)
    next()
}