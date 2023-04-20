import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserModel from "../dao/models/users.js";
import { createHash, validatePassword } from "../utils/hash.js";

const initPassport = () => {
  const options = {
    usernameField: "email",
    passReqToCallback: true,
  };
  passport.use(
    "register",
    new LocalStrategy(options, async (req, email, password, done) => {
      try {
        const body = {
          first_name: "Jorge",
          last_name: "Perez",
          email,
          age: 20,
          occupation: "Ingeniero",
          password: createHash(password),
        };
        const user = await UserModel.create(body);
        done(null, user);
      } catch (error) {
        const message = error.message || "Error al registrar usuario";
        return done(new Error(message), true);
      }
    })
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async ( email, password, done, req ) => {
        try {
          const isAdminUser =
            email === "adminCoder@coder.com" && password === "adminCod3r123";
          let user = isAdminUser
            ? {
                first_name: "adminCoder",
                rol: "Admin",
                email: "adminCoder@coder.com",
                password: createHash("adminCod3r123"),
              }
            : await UserModel.findOne({ email });
           if(!isAdminUser){
            user = JSON.parse(JSON.stringify(user));
            user.rol = "Usuario";
           }
            done(null, user);
        } catch (error) {
          const message = error.message || "Error al registrar usuario";
          return done(new Error(message), true);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
};

export default initPassport;
