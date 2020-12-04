const { v4: uuidv4 } = require('uuid'); // библиотека для генерации ID
const fs = require('fs')
const path = require('path')

class Course {
    constructor(title, price, image) {
        this.title = title
        this.price = price
        this.image = image
        this.id = uuidv4()
    }

    toJSON(){
        return {
            title : this.title,
            price : this.price,
            image : this.image,
            id : this.id
        }
    }

    async save(){
        const courses = await Course.getAll()
        courses.push(this.toJSON())
        return new Promise((res, rej) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err, content) => {
                    if (err) rej(err)
                    else {
                        res()
                    }
                }
            )
        })
        console.log("COURSES: ", courses)
    }

    static getAll(){
        return new Promise((res, rej) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (err, content) => {
                    if (err) rej(err)
                    else {
                        res(JSON.parse(content))
                    }
                }
            )
        })

    }
}

module.exports = Course