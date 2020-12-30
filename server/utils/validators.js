const {body} = require('express-validator')
const User = require('../models/user') // --- для динам. валидации --- //

exports.registrationValidator = [
    // body('email').isEmail().withMessage('incorrect email'),
    body('email').isEmail().withMessage('incorrect email').custom(async (value, {req}) => { // --- динамическая валидация --- //
        try {
            const user = await User.findOne({email: value})
            if (user){
                return Promise.reject('user has already exist') // --- нужно вернуть промисс --- //
            }
        } catch (err) {
            console.log(err)
        }
    }),
    body('password', 'incorrect password').isLength({min: 6, max: 20}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => { // --- кастомная проверка на совпадения паролей --- //
        if (value !== req.body.password) {
            throw new Error('passwords must be the same')
        } else {
            return true
        }
    }),
    body('name', 'very short name').isLength({min: 3}),
]