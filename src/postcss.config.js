module.exports = {
    plugins: [
        require('autoprefixer'),         //// автопрефиксер
        require('css-mqpacker'),         //// сжимает медиазапросы
        require('cssnano')({             //// минификатор
            preset: [
                'default', {
                    discardComments: {    //// удаляет коментарии
                        removeAll: true,
                    }
                }
            ]
        })
    ]
}