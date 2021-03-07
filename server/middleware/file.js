const multer = require('multer') // пакет для работы с файлами

const storage = multer.diskStorage({ // определяем куда будем сохранять файлы
    destination(req, file, callback){
        // 1 параметр - ошибка если есть
        // 2 параметр - папка где будут хранится имг
        callback(null, 'avatars')
    },
    filename(req, file, callback){
        // 1 параметр - ошибка если есть
        // 2 параметр - имя файла с датой, что бы не переписать файл с одинаковым именем
        callback(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']

const fileFilter = (req, file, callback) => { // валидация для файлов
    if (allowedTypes.includes(file.mimeType)){ // проверяем содержит ли файл маймтип из массива
        callback(null, true) // валидация пройдена
    } else {
        callback(null, false) // валидация не пройдена
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
})