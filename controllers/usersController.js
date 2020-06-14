const jwt = require("jsonwebtoken");
const config = require("../config/database");
const User = require("../models/Users");

module.exports = {
  authentication: function (req, res) {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.json({ success: false, msg: "User not found" });
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800,
          });
          res.json({
            success: true,
            token: `bearer ${token}`,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
            },
          });
        } else {
          return res.json({ success: false, msg: "Wrong Password" });
        }
      });
    });
  },
  profile: function (req, res) {
    let user = {};
    if (req.user.student) {
      // send student to React
      user.id = req.user._id;
      user.username = req.user.username;
      user.email = req.user.email;
      user.student = req.user.student;
      user.attendance = req.user.attendace;
      user.classwork = req.user.classwork;
      user.teacher = req.user.teacher;
      res.json(user);
    } else {
      // send teacher to React
      user.id = req.user._id;
      user.username = req.user.username;
      user.email = req.user.email;
      user.student = req.user.student;
      user.students = req.user.students;
      res.json(user);
    }
  },
};
