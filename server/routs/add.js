const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

router.get('/', (req, res, next) => {
    res.render('add', {
        title: "Add new course",
        isAdd: true
    })
})

router.post('/', async (req, res) => {
    const course = new Course(req.body.title, req.body.price, req.body.image)
    await course.save()
    res.redirect('/courses') // после обработки запроса переводит на др. страницу
})
module.exports = router