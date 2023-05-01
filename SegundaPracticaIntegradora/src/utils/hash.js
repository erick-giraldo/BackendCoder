import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import passport from 'passport'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const JWT_SECRET = process.env.JWT_SECRET

export const tokenGenerator = (user) => {
  const payload = {
    name: user.fullname,
    email: user.email,
    rol: user.rol,
  }
  const token = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: '24h' })
  console.log("🚀 ~ file: hash.js:24 ~ tokenGenerator ~ token:", token)
  return token
}

export const isValidToken = (token) => {
  return new Promise((resolve) => {
    jsonwebtoken.verify(token, JWT_SECRET, (error, payload) => {
      if (error) {
        console.log('err', error)
        return resolve(false)
      }
      console.log('payload', payload)
      return resolve(true)
    })
    return token
  })
}

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const validatePassword = (password, user) => {
  return bcrypt.compareSync(password, user.password)
}

export const authJWTMiddleware = (roles) => (req, res, next) => {
  passport.authenticate('jwt', function (error, user, info) {  
    if (error) {
      return next(error)
    }
    if (!user) { // Autenticación
      return next(new Exception('Unauthorized' , 401))
    }
    if (!roles.includes(user.role)) { // Autorización
      return next(new Exception('Forbidden' , 403))
    }
    if (user.role === 'user' && req.params.id && req.params.id !== user.id) {
      return next(new Exception('Forbidden' , 403))
    }
    req.user = user
    next()
  })(req, res, next)
}
