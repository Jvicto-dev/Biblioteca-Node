const jwt = require('jsonwebtoken')

function adminAuth(req, res, next) {

    const jwtSecret = "sjifdk654548"

    var token = req.session.user.token

    if (token != undefined) {

        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                req.flash('msg', 'Token falhou na authenticação')
                res.redirect('/')
            } else {
                req.data = data
                next()
            }
        })
    } else {
        req.flash('msg', 'não existe um token para authenticação !')
        res.redirect('/')
    }
}
function auth(req, res, next) {

    if (req.session.user != undefined) {
        next()
    } else {
        res.redirect('/')
    }

}

module.exports = auth
