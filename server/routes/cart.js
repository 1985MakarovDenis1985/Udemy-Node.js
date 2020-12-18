const {Router} = require('express')
const router = Router()
const Course = require('../models/course')



router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/courses')
})

router.delete('/remove/:id', async (req, res) => {
    const card = await Card.remove(req.params.id)
    res.status(200).json(card)
})

router.get('/', async (req, res) => {
    // const card = await Card.fetch()
    // res.render('card', {
    //     title: 'Cart',
    //     isCard: true,
    //     courses: card.courses,
    //     price: card.price
    // })
    res.json({test: true})
})



module.exports = router