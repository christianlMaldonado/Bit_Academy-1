import axios from "axios";

export default {
  // Auth API calls
  login: function(user) {
    return axios.post("/auth", user);
  },
  userPortal: function(token) {
    return axios.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
  },

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
  getStudents: function(id) {
    return axios.get(`/teacher/attendance/${id}`);
  },
  registerTeacher: function(teacher) {
    return axios.post("/teacher/register", teacher);
  },

  // API calls for Students
  getHomework: function(student) {
    return axios.get("/student/classWork", student);
  },
  submitHomework: function(homework) {
    return axios.put("/student/submitClasswork", homework);
  },
  checkIn: function(student) {
    return axios.put("/student/attendance", student);
  },
};
