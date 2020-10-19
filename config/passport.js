const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const { clientID, clientSecret } = require('./key')

const localStrategy = (passport) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (email, password, next) => {
            let isMatch = false
            try {
                //check user by email
                const user = await User.findOne({
                    email
                })
                if (!user) {
                    return next(null, false, { message: 'invalid email or password' })
                }
                if (user.password) {
                    //check password and compare password
                     isMatch = await bcrypt.compare(password, user.password)
                }


                //pssword is OK
                if (isMatch) {
                    return next(null, user, { message: 'Sucessfully Logged in' })
                }
                next(null, false, { message: 'invalid email or password' })
            } catch (err) {
                next(err);
            }
        }
    ))
    passport.serializeUser((user, next) => {
        next(null, user)
    })
    passport.deserializeUser(async (id, next) => {
        try {
            const user = await User.findById(id)
            next(null, user)
        } catch (err) {
            next(err)
        }

    })
}

const googleStrategy = (passport) => {
    passport.use(new GoogleStrategy({
        clientID,
        clientSecret,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshtoken, profile, next) => {
        try {
            const profileToSave = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value
            };
            const user = await User.findOne({ googleID: profile.id })
            if (user) {
                next(null, user)
            } else {
                const usertoSave = new User(profileToSave)
                await usertoSave.save({ validateBeforeSave: false })
                next(null, user)
            }
        } catch (err) {
            next(err)
        }
    }));
    passport.serializeUser((user, next) => {
        next(null, user)
    })
    passport.deserializeUser(async (id, next) => {
        try {
            const user = await User.findById(id)
            next(null, user)
        } catch (err) {
            next(err)
        }

    })
}



module.exports = {
    localStrategy,
    googleStrategy
}
