import bcrypt from  "bcrypt"

export const createHash = ( password ) =>{
  return bcrypt.hashSync( password, bcrypt.genSaltSync(10) )
}

export const validatePassword = ( password, user ) =>{
  return bcrypt.compareSync( password, user.password )
}

