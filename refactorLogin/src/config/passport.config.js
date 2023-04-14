import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport'

import UserModel from '../dao/models/users.js'
import { createHash, validatePassword } from "../utils/hash.js";

const initPassport = () =>{
    const options ={
        usernameField: 'email',
        passReqToCallback: true
    }
    passport.use('register', new LocalStrategy( options, async ( req, username, password, done ) =>{
        const {} = req
    }))
}
