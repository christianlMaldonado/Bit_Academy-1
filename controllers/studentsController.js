const User = require("../models/Users");

module.exports = {
  submitClasswork: function (req, res) {
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.body.user._id },
      { $set: { "classwork.$[elem]._id": req.body.id } },
      { arrayFilters: [{ "elem._id": { $eq: req.body.id } }] },
      (err, doc) => {
        if (err) throw err;
        if (!doc) {
          return res.json({ success: false, msg: "Classwork not found" });
        } else {
          doc.classwork.forEach((i) => {
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
    User.findOne({ username: studentName }, (err, student) => {
      if (err) throw err;
      res.json({ classwork: student.classwork });
    });
  },
  attendance: function (req, res) {
    const isPresent = {
      username: req.body.name,
      present: true,
    };
    User.findOneAndUpdate(
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
