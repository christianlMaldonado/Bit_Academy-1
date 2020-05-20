const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SchoolWorkSchema = mongoose.Schema({
  assignment: { name: String, grade: Number, link: String, description: String, kind: String },
});

const AttendanceSchema = mongoose.Schema({
  attendance: {
    isPresent: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
  },
});

const StudentSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  // school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  attendance: [AttendanceSchema],
  classWork: [SchoolWorkSchema],
});

const Student = (module.exports = mongoose.model("Student", StudentSchema));

module.exports.getStudentById = function (id, callback) {
  Student.findById(id, callback);
};

module.exports.getStudentByEmail = function (email, callback) {
  const query = { email: email };
  Student.findOne(query, callback);
};

module.exports.addStudent = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
