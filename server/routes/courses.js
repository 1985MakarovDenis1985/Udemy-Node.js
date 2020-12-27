const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Course = require('../models/course')

router.get('/', async (req, res, next) => {
    // const courses = await Course.find() //  метод из mongo find - означает, что будем забирать все курсы из базы данных

    // populate - показывает(открываем) user с этим id || select - получаем поля
    const courses = await Course.find()
        // .populate('userId', 'email', 'name')
        // .select('price title img')


    res.render('courses', {
        title: "Courses",
        isCourses: true,
        courses
    })
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id) // метод из mongo
    res.render('course-edit', {
        title: `change: ${course.title}`,
        course
    })
})

router.post('/edit', auth, async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body) // 1-находим ел 2-обновляем тело
    res.redirect('/courses')
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    }catch (err){
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Course: ${course.title}`,
        course
    })
})

module.exports = router