 const auth = (req, res, next) => {
    if (req.session.user) {
      return next()
    }
    return res.status(401).send('error de autorización')
    res.redirect('/login')
    
  }

  export default auth;