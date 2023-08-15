// passport.config.js
import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2';
import UserModel from "../dao/models/users.js";
import CartService from '../services/carts.service.js';
import UsersService from '../services/users.service.js';
import { tokenGenerator } from '../utils/hash.js';

const githubOptions = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK,
};

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
}

const initPassport = () => {
  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET,
  }, (payload, done) => {
    return done(null, payload);
  }));

  passport.use(new GitHubStrategy(githubOptions, async (accessToken, refreshToken, profile, done) => {
    try {
      if (profile._json.email === null) {
        return done(null, false, `El campo email es obligatorio`);
      }

      const user = {
        first_name: profile._json.name,
        last_name: 'Giraldo',
        email: profile._json.email,
        age: 18,
        password: '',
        rol: "usuario"
      };

      const newUser = { ...user };
      newUser.avatar = profile._json.avatar_url;

      const createCart = await CartService.create();
      const findCart = await CartService.getById(createCart._id);
      const cartBody = findCart && findCart.id ? [{ _id: createCart._id, id: findCart.id }] : [{ _id: createCart._id, id: 0 }];
      const createdUser = await UsersService.create(newUser);
      const id = createdUser[0]._id;
      await UsersService.updateUserCart(id, cartBody);
      const userResult = await UsersService.getById(id);
      const token = tokenGenerator(userResult);
 
      done(null, userResult, token);
    } catch (error) {
      const message = error.message || "Error al registrar o logear usuario";
      return done(new Error(message), true);
    }
  }));

  passport.serializeUser((user, done) => {
    console.log("🚀 ~ file: passport.config.js:69 ~ passport.serializeUser ~ done:", done)
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default initPassport;