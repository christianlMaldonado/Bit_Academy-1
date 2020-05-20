const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// const User = require("../models/user");
const config = require("../config/database");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

// Passport Authentication
module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(
    "teacher",
    new JwtStrategy(opts, (jwt_payload, done) => {
      Teacher.getTeacherById({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          return done(err, false);
        }

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );

  passport.use(
    "student",
    new JwtStrategy(opts, (jwt_payload1, done) => {
      Student.getStudentById({ _id: jwt_payload1._id }, (err, user) => {
        if (err) {
          return done(err, false);
        }

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
