const mongoose = require("mongoose");

// building teacher collection
const TeacherSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student" },
  school: { type: Schema.Types.ObjectId, ref: "School" },
});

const Teacher = (module.exports = mongoose.model("Teacher", TeacherSchema));
