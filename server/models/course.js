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
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    // поле ID mongoose будет добавлять автоматом
})

course.method('toClient', function (){
    const course = this.toObject()
    course.id = course._id
    delete course._id
    return course
})


// экспортируем модель: 1параметр - название модели, 2параметр - сама модель
module.exports = model('Course', course)