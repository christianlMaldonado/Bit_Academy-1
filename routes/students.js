const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentsController");

// student classroom routes
router.route("/submitClasswork").put(controller.submitClasswork);

router.route("/classWork").get(controller.getClasswork);

router.route("/attendance").post(controller.attendance);

module.exports = router;
