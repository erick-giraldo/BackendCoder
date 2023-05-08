const isLoged = (req, res, next) => {
  if (!req.cookies.token) {
    return next()
  }
  res.redirect('/products')    
}

export default isLoged;