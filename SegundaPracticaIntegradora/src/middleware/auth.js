 const auth = (req, res, next) => {
    if (res.cookie) {
      return next()
    }
    res.redirect('/401')    
  }

  export default auth;