const passport = require('passport')
const GOOGLE_CLIENT_ID = '1005066731242-r36ig3cthd053m8i290p5ctghkq13lk2.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET ='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'
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4006/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(null, profile);
    });
  }
));
passport.serializeUser(function(user,done){
  done(null,user);
})
passport.deserializeUser(function(user,done){
  done(null,user);
})
