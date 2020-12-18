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
    }catch (err){
        console.log(err)
    }
})
module.exports = router