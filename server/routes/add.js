const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Course = require('../models/course')
const {validationResult} = require('express-validator')
const {addCourseValidator} = require('../utils/validators')

// --- auth- через запятую добавляем мидлвар --- //
// --- защищаем таким образом роут от неавторизированых пользователей --- //
router.get('/', auth, (req, res, next) => {
    res.render('add', {
        title: "Add new course",
        isAdd: true,
    })
})

router.post('/', auth, addCourseValidator, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: "Add new course",
            isAdd: true,
            errors: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img
            }
        })
    }

    // const course = new Course(req.body.title, req.body.price, req.body.image)
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user._id
    })
    try {
        await course.save()
        res.redirect('/courses') // после обработки запроса переводит на др. страницу
    } catch (err) {
        console.log(err)
    }
})
module.exports = router