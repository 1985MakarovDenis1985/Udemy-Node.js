const path = require('path')
const fs = require('fs')
const os = require('os')
const EventEmitter = require('events')
const http = require('http')


// ------------- работа с console.log ----------------

console.log(process.argv)


// ------------- HTTP part 2 ----------------

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/views; charset=utf-8'
        })

        if (req.url === '/') {
            fs.readFile(
                path.join(__dirname, 'title.views'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        throw err
                    }
                    res.end(content)
                }
            )
        } else if (req.url === '/about') {
            fs.readFile(
                path.join(__dirname, 'about.views'), // path.join(__dirname, 'папка', 'about.views')
                'utf-8',
                (err, content) => {
                    if (err) {
                        throw err
                    }

                    res.end(content)
                }
            )
        }
        // получаем просто данные на запрос
        else if (req.url === '/api/users') {
            res.writeHead(200, {
                'Content-Type': 'text/json'
            })
            const users = [
                {name: 'Denys'},
                {name: 'Valentyna'}
            ]
            res.end(JSON.stringify(users))
        }
    } else if (req.method === 'POST') {
        const body = []
        res.writeHead(200, {
            'Content-Type': 'text/views; charset=utf-8'
        })

        req.on('data', data => {
            body.push(Buffer.from(data))
        })

        req.on('end', () => {
            const message = body.toString().split('=')[1]

            res.end(`
        <h1>Ваше сообщение: ${message}</h1>
      `)
        })
    }
})
server.listen(3000, () => {
    console.log('Server is running...')
})


// ------------- HTTP part 1 ----------------

// http.createServer((req, res) => {
//
//     if (req.method === 'GET') {
//         res.writeHead(200, {
//             'Content-type': 'text/views'
//         })
//         res.end(`
//             <h1>Form</h1>
//             <form method="post" action="/">
//                 <input type="text" name="title">
//                 <button type="submit">Send</button>
//             </form>
//         `)
//
//     } else if (req.method === 'POST'){
//         const body = []
//
//         res.writeHead(200, {
//             'Content-type': 'text/views; charset=utf-8', // указываем кодировку запроса
//         })
//
//         // прослушиваем данные из формы
//         req.on('data', data => {
//             body.push(Buffer.from(data))
//         })
//
//         req.on('end', () => {
//             const message = body.toString().split('=')[1] // разделили там где "=" и взяли второй ели
//             res.end(`
//             <h1>Ваше сообщение: ${message}</h1>
//         `)
//         })
//     }
//
// }).listen(3000, () => {
//     console.log('server... ')
// })


// ------------- eventEmitter() ----------------

// прослушивание событий
// class Logger extends EventEmitter {
//     log(message){
//         this.emit('massage', `${message} ${Date.now()}`)
//     }
// }
// const Log = new Logger()
// Log.on('massage', data => {
//     console.log(data)
// })
//
// Log.log("Hello!!!")
// ------------------------------------


// -------------- os() ----------------

// console.log(os.platform()) // darwin
// console.log(os.arch()) // x64
// console.log(os.cpus()) // информация о процессоре
// console.log(os.freemem()) // свободная память
// console.log(os.totalmem()) // сколько всего памяти
// console.log(os.homedir()) // корневая директория компьютера
// console.log(os.uptime()) // сколько система уже работает
// ------------------------------------


// -------------- fs() ----------------

// --- создание ---
// fs.mkdir(path.join(__dirname, 'newFolder'), err => { // в node.js первый параметр всегда ошибка
//     if (err) throw new Error(err)
//     console.log("новая папка была создана")
// })

// --- запись и доп ---
// fs.writeFile(
//     path.join(__dirname, 'note.txt'),
//     'Hello word',
//     (err) => {
//         if (err) throw err
//         console.log("файл был создан")
//
//         // чтение
//         fs.readFile(
//             path.join(__dirname, 'note.txt'),
//             'utf-8',
//             (err, data) => { // 1: ошибка, 2: данные
//                 if (err) throw err
//                 console.log(data)
//                 // console.log(Buffer.from(data).toString()) // - если нет utf-8
//             }
//         )
//
//         // изменения
//         fs.appendFile(path.join(__dirname, 'note.txt'),
//             ' APPEND File',
//             (err) => {
//                 if (err) throw err
//                 console.log("в файле произошли изменения")
//             }
//         )
//     }
// )

// --- переименовать ---
// fs.rename(
//     path.join(__dirname, 'note.txt'),
//     path.join(__dirname, 'note_rename.txt'),
//     (err) => {
//         if (err) throw err
//         console.log("переименование прошло успешно")
//     }
// )
// ------------------------------------


// -------------- path() ----------------

// console.log(path.basename(__filename))
// console.log(path.dirname(__filename))
// console.log(path.extname(__filename))

// console.log(path.parse(__filename)) // super - сведение о файле и пути
// console.log(path.join(__dirname, "newFolder, text.txt")) // сгенерировали путь
// console.log(path.resolve(__dirname, "./newFolder, /text.txt")) // принимает составные части пути и возвращает абсолютный путь
// console.log(path.normalize(__dirname, '/srv//app///app.js')) // создает нормальный путь без ошибок





