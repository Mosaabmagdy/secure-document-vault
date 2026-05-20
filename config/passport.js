const passport = require('passport');

const GoogleStrategy =
require('passport-google-oauth20').Strategy;

const db = require('./db');

require('dotenv').config();

passport.use(

    new GoogleStrategy(

        {
            clientID:
                process.env.GOOGLE_CLIENT_ID,

            clientSecret:
                process.env.GOOGLE_CLIENT_SECRET,

           callbackURL:
'https://localhost:5000/api/auth/google/callback'
        },

        (accessToken, refreshToken, profile, done) => {

            const email =
                profile.emails[0].value;

            db.query(

                'SELECT * FROM users WHERE email=?',

                [email],

                (err, result) => {

                    if (err) {
                        return done(err, null);
                    }

                    if (result.length > 0) {

                        return done(
                            null,
                            result[0]
                        );
                    }

                    db.query(

                        'INSERT INTO users(name,email,google_id) VALUES(?,?,?)',

                        [
                            profile.displayName,
                            email,
                            profile.id
                        ],

                        (err2, insertResult) => {

                            if (err2) {
                                return done(err2, null);
                            }

                            done(null, {
                                id: insertResult.insertId,
                                role: 'user'
                            });
                        }
                    );
                }
            );
        }
    )
);

module.exports = passport;