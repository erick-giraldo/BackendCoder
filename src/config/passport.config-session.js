import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import UserModel from "../dao/models/users.js";
import { createHash, validatePassword } from "../utils/index.js";

const initPassport = () => {
  const registerOptions = {
    usernameField: "email",
    passReqToCallback: true,
  };

  const loginOptions = {
    usernameField: "email",
  };

  const githubOptions = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK,
  };

  passport.use(
    "register",
    new LocalStrategy(registerOptions, async (req, email, password, done) => {
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
    new LocalStrategy(loginOptions, async (email, password, done, req) => {
      try {
        const isAdminUser =
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD;
        let user = isAdminUser
          ? {
              first_name: process.env.ADMIN_NAME,
              last_name: "",
              role: "admin",
              email: process.env.ADMIN_EMAIL,
              password: createHash(process.env.ADMIN_PASSWORD),
            }
          : await UserModel.findOne({ email });
        if (!isAdminUser) {
          user = JSON.parse(JSON.stringify(user));
          user.rol = "Usuario";
        }
        done(null, user);
      } catch (error) {
        const message = error.message || "Error al registrar usuario";
        return done(new Error(message), true);
      }
    })
  );

  passport.use(
    new GithubStrategy(
      githubOptions,
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (profile._json.email === null) {
            return done(null, false, `El campo emal es obligatorio`);
          }
          let user = await UserModel.findOne({ email: profile._json.email });
          if (!user) {
            user = await UserModel.create({
              first_name: profile._json.name,
              email: profile._json.email,
              age: 18,
              password: "",
              rol: "Usuario",
            });
          }
          user = JSON.parse(JSON.stringify(user));
          user.avatar = profile._json.avatar_url;

          user.rol = "Usuario";

          done(null, user);
        } catch (error) {
          const message =
            error.message || "Error al registrar o logear usuario";
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
