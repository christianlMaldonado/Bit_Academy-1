const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentsController");
const passport = require("passport");

// student authentication routes
router.route("/auth").post(controller.authentication);

router.get("/profile", passport.authenticate("student", { session: false }), controller.profile);

// student classroom routes
router.route("/submitClasswork").put(controller.submitClasswork);

router.route("/classWork").get(controller.getClasswork);

router.route("/attendance").post(controller.attendance);

module.exports = router;
