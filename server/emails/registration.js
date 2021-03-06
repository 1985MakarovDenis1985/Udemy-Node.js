const keys = require('../keys')

module.exports = function (email, name){
    return {         // --- оправляем имейл пользователю после регистрации --- //
        to: email,
        from: keys.EMAIL_FROM,
        subject: "registration was successful", // --- тема письма --- //
        // --- отправка данных в виде html --- //
        html: `     
              <h1>Welcome to store ${name}</h1>
              <p>Your account was created with success</p>
              <hr/>
              
              <a href="${keys.BASE_URL}">Go to store</a>
        `
    }
}