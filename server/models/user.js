const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    // связываем с моделью Schema из моделс
                    ref: 'Course',
                    required: true
                }
            }
        ],
    }
})

userSchema.methods.addToCart = function (course) {
    const items = [...this.cart.items]
    const idx = items.findIndex(el => {
        return el.courseId.toString() === course._id.toString()
    })

    if (idx >= 0) { // имеется в виду, что товар такого типа уже есть в корзине
        items[idx].count = items[idx].count += 1
    } else {

        items.push({ // добавляем товар в корзину пользователя
            courseId: course._id,
            count: 1
        })
    }

    // const newCart = {items: items}
    // this.cart = newCart

    this.cart = {items: items}
    return this.save()
}


// экспортируем модель: 1параметр - название модели, 2параметр - сама модель
module.exports = model('User', userSchema)