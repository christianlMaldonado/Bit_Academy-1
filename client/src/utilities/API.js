import axios from "axios";

export default {
  // API calls for teachers
  addStudent: function(student) {
    return axios.post("/teacher/addStudent", student);
  },
  addHomework: function(homework) {
    return axios.post("/teacher/classwork", homework);
  },
  gradeAssignment: function(homework) {
    return axios.put("/teacher/classwork", homework);
  },
  takeAttendance: function() {
    return axios.get("/teacher/attendance");
  },
  registerTeacher: function(teacher) {
    return axios.post("/teacher/register", teacher);
  },
  loginTeacher: function(user) {
    return axios.post("/teacher/auth", user);
  },
  teacherPortal: function(token) {
    return axios.get("/teacher/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
  },
  // API calls for Students
  loginStudent: function(user) {
    return axios.post("/student/auth", user);
  },
  studentPortal: function(token) {
    return axios.get("/student/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
  },
  getHomework: function(student) {
    return axios.get("/student/classWork", student);
  },
  submitHomework: function(homework) {
    return axios.post("/student/submitClasswork", homework);
  },
  checkIn: function(student) {
    return axios.put("/student/attendance", student);
  },
};
