 const auth = (req, res, next) => {
  if (req.cookies.token) {
      res.redirect('/login')  
    }
    res.redirect('/login')    
  }

  export default auth;