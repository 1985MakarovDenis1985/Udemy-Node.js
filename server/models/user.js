const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExp: Date,
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

 userSchema.methods.removeFromCart = function (id){
    let items = [...this.cart.items] // что-бы избежать мутаций
    const idx = items.findIndex(el => el.courseId.toString() === id.toString())

    if (items[idx].count === 1){
        items = items.filter(el => el.courseId.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = {items};
    return this.save()
}

userSchema.methods.clearCart = function (){
    this.cart = []
    return this.save()
}


// экспортируем модель: 1параметр - название модели, 2параметр - сама модель
module.exports = model('User', userSchema)