import bcrypt from  "bcrypt"

export const getEmptyProperties = ( object ) => {
    var emptyProperties = [];
    for (var key in object) {
      if (object.hasOwnProperty(key) && !object[key]) {
        emptyProperties.push(key);
      }
    }
    return emptyProperties;
  }

export const createHash = ( password ) =>{
  return bcrypt.hashSync( password, bcrypt.genSaltSync(10) )
}

export const validatePassword = ( password, user ) =>{
  return bcrypt.compareSync( password, user.password )
}



