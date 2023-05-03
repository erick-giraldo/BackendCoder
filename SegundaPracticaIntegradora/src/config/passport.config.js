import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GitHubStrategy } from 'passport-github2'
import UserModel from "../dao/models/users.js";
import { tokenGenerator } from "../utils/hash.js";

const githubOptions = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK,
}


function cookieExtractor(req) {
  let token = null
  if (req && req.cookies) {
    token = req.cookies.token
  }
  return token
}

const initPassport = () => {
  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET,
  }, (payload, done) => {
    return done(null, payload)
  }))
}

passport.use(new GitHubStrategy(githubOptions,async (accessToken, refreshToken, profile, done)  =>{
   
  try {
    const JWT_SECRET = process.env.JWT_SECRET
    if(profile._json.email === null){
      return done(null, false, `El campo emal es obligatorio`);
    }
    let user = await UserModel.findOne({ email: profile._json.email });
    if (!user) {
      user = await UserModel.create({
        first_name: profile._json.name,
        email: profile._json.email,
        age: 18,
        password: '',
        rol: "Usuario"
      });
    } 
    user = JSON.parse(JSON.stringify(user));
    user.avatar =  profile._json.avatar_url;

    user.role = "user";
    done(null, user);
  } catch (error) {
    const message = error.message || "Error al registrar o logear usuario";
    return done(new Error(message), true);
  }
}))

passport.serializeUser((user, done) => {
  console.log("🚀 ~ file: passport.config.js:61 ~ passport.serializeUser ~ user:", user)
  done(null, user._id)
})

passport.deserializeUser( async (id, done) => {
  let user = await UserModel.findById(id)
  done(null, user)
})

export default initPassport