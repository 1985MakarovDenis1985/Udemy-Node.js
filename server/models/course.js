const {Schema, model} = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true // говорит о том, что поле обязательно для модели
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        // required: true
    }
    // поле ID mongoose будет добавлять автоматом
})


// экспортируем модель: 1параметр - название модели, 2параметр - сама модель
module.exports = model('Course', course)