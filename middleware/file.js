const multer = require('multer') // пакет для работы с файлами

const storage = multer.diskStorage({ // определяем куда будем сохранять файлы
    destination(req, file, cb){
        // 1 параметр - ошибка если есть
        // 2 параметр - папка где будут хранится имг
        cb(null, 'images')
    },
    filename(req, file, cb){
        // 1 параметр - ошибка если есть
        // 2 параметр - имя файла с датой, что бы не переписать файл с одинаковым именем
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']

const fileFilter = (req, file, cb) => { // валидация для файлов
    if (allowedTypes.includes(file.mimetype)){ // проверяем содержит ли файл маймтип из массива
        cb(null, true) // валидация пройдена
    } else {
        cb(null, false) // валидация не пройдена
    }
}

module.exports = multer({
    storage,
    fileFilter
})