const User = require("../models/Users");

module.exports = {
  create: function (req, res) {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      student: false,
      students: [],
    });

    User.addUser(newUser, (err, user) => {
      if (err) {
        // console.log(err);
        res.json({ success: false, msg: "Failed to register user." });
      } else {
        res.json({ success: true, msg: "User registered successfully!" });
      }
    });
  },

  createStudent: function (req, res) {
    let newStudent = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      teacher: req.body.teacherId,
      student: true,
      attendance: [],
      classwork: [],
    });

    User.addUser(newStudent, (err, student) => {
      if (err) {
        res.json({ success: false, msg: "Failed to add student" });
      } else {
        // student.teacher = newStudent.teacher;
        User.findOne(student.teacher, (err, teacher) => {
          if (err) throw err;
          teacher.students.push(student._id);
          teacher.save((err, teacher) => {
            if (err) throw err;
            res.json({ success: true, msg: "Student added successfully" });
          });
        });
      }
    });
  },
  addClasswork: function (req, res) {
    User.updateMany(
      { student: req.body.isStudent, teacher: req.body._id },
      {
        $push: {
          classwork: {
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
        console.log(homework);
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
    User.findOneAndUpdate(
      { username: homework.username },
      {
        $set: {
          "classwork.$[elem].grade": homework.grade,
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
          student.classwork.forEach((element) => {
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
  findStudents: function (req, res) {
    User.find({ teacher: req.params.id }, (err, students) => {
      if (err) throw err;
      res.json(students);
    });
  },
};
