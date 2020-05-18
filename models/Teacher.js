const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// building teacher collection
const TeacherSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  // school: { type: Schema.Types.ObjectId, ref: "School" },
});

const Teacher = (module.exports = mongoose.model("Teacher", TeacherSchema));

module.exports.getTeacherById = function (id, callback) {
  Teacher.findById(id, callback);
};

module.exports.getTeacherByEmail = function (email, callback) {
  const query = { email: email };
  Teacher.findOne(query, callback);
};

module.exports.addTeacher = function (newUser, callback) {
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
