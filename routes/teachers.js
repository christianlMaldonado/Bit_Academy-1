const express = require("express");
const router = express.Router();
const controller = require("../controllers/teachersController");

// teacher routes to login and register
router.route("/register").post(controller.create);

// classroom routes for teachers
router.route("/addStudent").post(controller.createStudent);

router.route("/classwork").post(controller.addClasswork).put(controller.gradeAssignment);

router.route("/attendance/:id").get(controller.findStudents);

module.exports = router;
