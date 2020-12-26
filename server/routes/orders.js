const {Router} = require('express')
const router = Router()
const Order = require('../models/order')


router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id // условие совпадения определенного юзера
        }).populate('user.userId')
            res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(el => {
                return {
                    ...el._doc,
                    price: el.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            })
        })
    } catch (err) {
        console.log(err)
    }

})


router.post('/', async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId')
            .execPopulate()

        const courses = user.cart.items.map(el => ({
            count: el.count,
            course: {...el.courseId._doc}
        }))

        const orders = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })

        await orders.save()
        await req.user.clearCart()

        res.redirect('/orders')

    } catch (err) {
        console.log(err)
    }


})

module.exports = router