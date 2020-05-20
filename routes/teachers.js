const express = require("express");
const router = express.Router();
const controller = require("../controllers/teachersController");
const passportTeacher = require("passport");

// teacher routes to login and register
router.route("/register").post(controller.create);

router.route("/auth").post(controller.authentication);

router.get(
  "/profile",
  passportTeacher.authenticate("teacher", { session: false }),
  controller.profile
);

// classroom routes for teachers
router.route("/addStudent").post(controller.createStudent);

router.route("/classwork").post(controller.addClasswork).put(controller.gradeAssignment);

router.route("/attendance").get(controller.checkAttendance);

module.exports = router;
