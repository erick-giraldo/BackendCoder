import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import app  from '../app.js';
import UserModel from "../dao/models/users.js";
import { createHash, validatePassword } from "../utils/hash.js";

const initPassport = () => {
  const options = {
    usernameField: "email",
    passReqToCallback: true,
  };
  passport.use('register', new LocalStrategy(options, async (req, email, password, done) => {
      const body = {
        first_name: "Jorge",
        last_name: "Perez",
        email: email,
        age: 20,
        occupation: "Ingeniero",
        password: createHash(password)
      };
      const requiredFields = ["first_name", "last_name", "email", "age", "occupation", "password"];

      try {
        const userData = requiredFields.reduce((data, field) => {
          if (!body[field]) {
            return done( null, false , req.flash( 'signupMessage' , `El campo ${field} es obligatorio` ));
          }
            return{ ...data, [field]: body[field] };
        }, {});
        console.log("🚀 ~ file: passport.config.js:30 ~ userData ~ userData:", userData)
      console.log('appsssss',app.locals)


        let user = await UserModel.findOne( { email : userData.email } );

        if (user) {
          console.log("usuaro ya existe");
          return done(req.flash( 'signupMessage' , 'usuaro ya existe'));
        }

        user = await UserModel.create(userData);
        console.log("new user", user);
        done(null, user, { status: 200 });

      } catch (error) {
        console.error(error);
        const message = error.message || "Error al registrar usuario";
        return done(new Error({ status: 400 }, message, error)) ;
      }
    })
  );

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async ( email, password, done ) => {
    try {
        if (!email || !password) {
          return done(null, user, { status: 400 }, {
            message: "Los campos email and password son requeridos",
          });
        }
        let user;
        const isAdminUser = email === " " && password === "adminCod3r123";
        if (isAdminUser) {
          user = {
            first_name: "adminCoder",
            rol: "Admin",
            email: "adminCoder@coder.com",
          };
        } else {
          user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, user, { status: 400 }, {
                message: "Usuario no existe",
              });
          }
          if (!validatePassword(password, user)) {
            return done(null, user, { status: 400 }, {
                message: "Credenciales invalidas por favor revisar y volver a iniciar sesión",
              });
          }
          user = JSON.parse(JSON.stringify(user));
          user.rol = "Usuario";
        }

        done(null,user, { success: true })

      } catch (error) {
        const errorDetail = error.message;
        return done(null, false,  {
            status: 400,
            message: "Error al iniciar sesión",
            error: { detail: errorDetail }
          });
      }
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser( async (id, done) => {
    let user = await UserModel.findById(id)
    done(null, user)
  })

};


export default initPassport;