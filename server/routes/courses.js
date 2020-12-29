const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Course = require('../models/course')

function isOwner(course, req) { // --- проверяем владельца курса --- //
    return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res, next) => {
    try {
        // populate - показывает(открываем) user с этим id || select - получаем поля
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('price title img')


        res.render('courses', {
            title: "Courses",
            isCourses: true, // --- req.user присвоен в middleware --- //
            userId: req.user ? req.user._id.toString() : null,
            courses
        })
    } catch (err) {
        console.log(err)
    }

})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const course = await Course.findById(req.params.id) // метод из mongo

        if (!isOwner(course, req)) { // --- проверка: ты ли добавил курс?
            res.redirect('/courses')
        }

        res.render('course-edit', {
            title: `change: ${course.title}`,
            course
        })

    } catch (err) {
        console.log(err)
    }
})

router.post('/edit', auth, async (req, res) => {
    try {
        const {id} = req.body
        delete req.body.id
        const course = await Course.findById(id) // метод из mongo

        if (!isOwner(course, req)) {
            return res.redirect('/courses')
        }

        // await Course.findByIdAndUpdate(id, req.body) // 1-находим ел 2-обновляем тело
        Object.assign(course, req.body)
        await course.save()
        res.redirect('/courses')
    } catch (err) {
        console.log(err)
    }
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            layout: 'empty',
            title: `Course: ${course.title}`,
            course
        })
    }catch (err){

    }


})

module.exports = router