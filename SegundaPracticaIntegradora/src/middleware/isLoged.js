const isLoged = (req, res, next) => {
  console.log("ddddd",req.cookies.token)
  if (!req.cookies.token) {
    return next()
  }
  res.redirect('/products')    
}

export default isLoged;