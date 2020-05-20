const jwt = require("jsonwebtoken");
const config = require("../config/database");
const Student = require("../models/Student");

module.exports = {
  authentication: function (req, res) {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    Student.getStudentByEmail(email, (err, user) => {
      if (err) {
        res.status(401).json({ message: "Access Denied" });
      }
      if (!user) {
        res.status(401).json({ message: "User not found" });
      }
      Student.comparePassword(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(401).json({ message: "Access Denied" });
        }
        if (isMatch) {
          const token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800,
          });
          res.json({
            success: true,
            token: `bearer ${token}`,
            user: { id: user._id, username: user.name, email: user.email },
          });
        } else {
          return res.json({ success: false, message: "Wrong Password" });
        }
      });
    });
  },
  profile: function (req, res) {
    res.json({
      student: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        teacher: req.user.teacher,
        attendance: req.user.attendance,
        classWork: req.user.classWork,
      },
    });
  },
  submitClasswork: function (req, res) {
    Student.findOneAndUpdate(
      { _id: req.body.user._id },
      { $set: { "classWork.$[elem]._id": req.body.id } },
      { arrayFilters: [{ "elem._id": { $eq: req.body.id } }] },
      (err, doc) => {
        if (err) throw err;
        if (!doc) {
          return res.json({ success: false, msg: "Classwork not found" });
        } else {
          doc.classWork.forEach((i) => {
            if (i._id == req.body.id) {
              i.assignment.link = req.body.link;
            }
          });
          doc.save((err, doc) => {
            if (err) throw err;
            res.json({ success: true, msg: "Classwork updated" });
          });
        }
      }
    );
  },
  getClasswork: function (req, res) {
    const studentName = req.body.student;
    Student.findOne({ username: studentName }, (err, student) => {
      if (err) throw err;
      res.json({ classwork: student.classWork });
    });
  },
  attendance: function (req, res) {
    const isPresent = {
      username: req.body.name,
      present: true,
    };
    Student.findOneAndUpdate(
      { username: isPresent.username },
      { $push: { attendance: { isPresent: isPresent.present } } },
      (err, student) => {
        if (err) throw err;
        if (!student) {
          return res.json({ success: false, msg: "Student not found" });
        }
        res.json({ success: true, msg: "Attendance taken" });
      }
    );
  },
};
