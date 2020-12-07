const path = require('path')
const fs = require('fs')

// еще один способ прописи пути
const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
)

class Card {
    static async add(course) {
        const card = await Card.fetch()
        const index = card.courses.findIndex(el => el.id === course.id)
        const candidate = card.courses[index]

        if (candidate){
            candidate.count++
            card.courses[index] = candidate
        } else {
            course.count = 1
            card.courses.push(course)
        }

        card.price += +course.price

        return new Promise((res, rej) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err){
                    rej(err)
                }
                else {
                    res()
                }
            })
        })
    }

    static async fetch() {
        return new Promise((res, rej) => {
            // первым параметром всегда идет ошибка err
            fs.readFile(p, 'utf-8', (err, data) => {
                if (err) {
                    rej(err)
                } else {
                    res(JSON.parse(data))
                }
            })
        })
    }

    static async remove(id){
        const card = await Card.fetch()

        const idx = card.courses.findIndex(el => el.id === id)
        const course = card.courses[idx]

        if (course.count === 1){
            //удаляем
            card.courses = card.courses.filter(c => c.id !== id)
        } else {
            //уменьшаем
            card.courses[idx].count--
        }
        card.price -= course.price

        return new Promise((res, rej) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err){
                    rej(err)
                }
                else {
                    res(card)
                }
            })
        })
    }

}

module.exports = Card