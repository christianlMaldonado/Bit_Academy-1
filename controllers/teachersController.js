const jwt = require("jsonwebtoken");
const config = require("../config/database");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const mongoose = require("mongoose");

module.exports = {
  create: function (req, res) {
    let newUser = new Teacher({
      username: req.body.name,
      email: req.body.email,
      password: req.body.password,
      student: [],
    });

    Teacher.addTeacher(newUser, (err, user) => {
      if (err) {
        res.json({ success: false, msg: "Failed to register user" });
      } else {
        res.json({ success: true, msg: "User registered successfully" });
      }
    });
  },
  authentication: function (req, res) {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    Teacher.getTeacherByEmail(email, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.json({ success: false, msg: "User not found" });
      }

      Teacher.comparePassword(password, user.password, (err, isMatch) => {
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
    res.json({ user: req.user });
  },
  createStudent: function (req, res) {
    let newStudent = new Student({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      teacher: req.body.teacherId,
    });

    Student.addStudent(newStudent, (err, student) => {
      if (err) {
        res.json({ success: false, msg: "Failed to add student" });
      } else {
        student.teacher = newStudent.teacher;
        Teacher.findOne(newStudent.teacher, (err, teacher) => {
          if (err) throw err;
          teacher.student.push(student._id);
          teacher.save((err, teacher) => {
            if (err) throw err;
            res.json({ success: true, msg: "Student added successfully" });
          });
        });
      }
    });
  },
  addClasswork: function (req, res) {
    Student.updateMany(
      {},
      {
        $push: {
          classWork: {
            assignment: {
              name: req.body.assignment,
              grade: 0,
              link: "",
              description: req.body.description,
              kind: req.body.kind,
            },
          },
        },
      },
      (err, homework) => {
        if (err) throw err;
        res.json({ success: true, msg: "classwork added" });
      }
    );
  },
  gradeAssignment: function (req, res) {
    const homework = {
      username: req.body.student,
      assignment: req.body.assignment,
      grade: req.body.grade,
    };
    Student.findOneAndUpdate(
      { username: homework.username },
      {
        $set: {
          "classWork.$[elem].grade": homework.grade,
        },
      },
      {
        arrayFilters: [{ "elem.grade": { $lte: homework.grade } }],
        multi: false,
        $upsert: true,
      },
      (err, student) => {
        if (err) throw err;
        if (!student) {
          return res.json({ success: false, msg: "Student not found" });
        } else {
          student.student.classWork.forEach((element) => {
            if (element.assignment.name === homework.assignment) {
              element.assignment.grade = homework.grade;
            }
          });
          student.save(function (err, student) {
            res.json(student);
          });
        }
      }
    );
  },
  checkAttendance: function (req, res) {
    Student.find({}, (err, students) => {
      if (err) throw err;
      res.json(students);
    });
  },
};
