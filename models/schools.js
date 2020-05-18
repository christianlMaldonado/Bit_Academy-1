const mongoose = require("mongoose");

const SchoolSchema = mongoose.Schema({
  name: { type: String },
  teachers: { type: Schema.Types.ObjectId, ref: "Teacher" },
  students: { type: Schema.Types.ObjectId, ref: "Student" },
});

module.exports = mongoose.model("School", SchoolSchema);
