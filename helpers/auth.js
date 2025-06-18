module.exports.checkAuth = function(req, res, next) {

    const userid = req.session.userid

    if(!userid) {
       return res.redirect('/login')
    }

    next()
}