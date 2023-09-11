const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/users");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwtStrategy = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const { ExtractJwt } = require("passport-jwt");
const { secretKey } = require("./config");
// const { jwtPassport } = require("./authenticate");

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (id) => {
  return jwt.sign(id, secretKey, { expiresIn: 3600 });
};
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, ({ _id }, done) => {
    User.findOne({ _id }, (err, user) => {
      if (err) return done(err, false);
      else if (user) return done(null, user);
      else return done(null, false);
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });
