const keys = require('../keys')

module.exports = function (email, token){
    return {         // --- оправляем имейл пользователю после регистрации --- //
        to: email,
        from: keys.EMAIL_FROM,
        subject: "recover password", // --- тема письма --- //
        // --- отправка данных в виде html --- //
        html: `     
              <h1>Did You forget the password?</h1>
              <p>If no to ignore this message</p>
              <p>Otherwise click the link:</p>
              <p><a href="${keys.BASE_URL}/auth/password/${token}">recover access</a></p>
              <hr/>
              
                      `
    }
}