const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res, next) => {
    const courses = await Course.getAll()

    res.render('courses', {
        title: "Courses",
        isCourses: true,
        courses
    })
})

module.exports = router