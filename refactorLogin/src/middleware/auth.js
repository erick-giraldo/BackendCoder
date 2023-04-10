 const auth = (req, res, next) => {
    if (req.session.user) {
      return next()
    }
    res.redirect('/401')    
  }

  export default auth;