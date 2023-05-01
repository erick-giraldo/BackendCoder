const isLoged = (req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  res.redirect('/products')    
}

export default isLoged;