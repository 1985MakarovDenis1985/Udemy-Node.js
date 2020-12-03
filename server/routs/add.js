const {Router} = require('express')
const router = Router()

router.get('/',  (req, res, next) => {
    res.render('add', {
        title: "Add new course",
        isAdd: true
    })
})

router.post('/', (req, res) => {
    console.log(req.body)

    res.redirect('/courses') // после обработки запроса переводит на др. страницу
})
module.exports = router