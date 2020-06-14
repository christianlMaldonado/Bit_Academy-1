const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const SchoolWorkSchema = new Schema({
  assignment: { name: String, grade: Number, link: String, description: String, kind: String },
});

const AttendanceSchema = new Schema({
  attendance: {
    isPresent: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
  },
});

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true, lowercase: true, unique: true },
  student: { type: Boolean, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  attendance: [AttendanceSchema],
  classwork: [SchoolWorkSchema],
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByEmail = function (email, callback) {
  const query = { email: email };
  User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {
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
