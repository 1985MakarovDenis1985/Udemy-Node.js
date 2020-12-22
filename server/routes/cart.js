const {Router} = require('express')
const router = Router()
const Course = require('../models/course')

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count

    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/courses')
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id) // params.id берем из адресной строки
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = mapCartItems(user.cart)
    const cart = {
        courses,
        price: computePrice(courses)
    }

    res.status(200).json(cart)
})

router.get('/', async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()

    const courses = mapCartItems(user.cart)
    // console.log(courses)

    res.render('cart', {
        title: 'Cart',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    })
})


module.exports = router
