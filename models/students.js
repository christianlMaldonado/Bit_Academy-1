const mongoose = require("mongoose");

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
  email: { type: String, required: true },
  password: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
  school: { type: Schema.Types.ObjectId, ref: "School" },
  attendance: [AttendanceSchema],
  classWork: [SchoolWorkSchema],
});

module.exports = mongoose.model("Student", StudentSchema);
