 const auth = (req, res, next) => {
  if (req.cookies.token) {
      return next()
    }
    res.redirect('/login')    
  }

  export default auth;