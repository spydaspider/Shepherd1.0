const express = require("express");

const router = express.Router();

const {
    markAttendance
}
=
require("../controllers/attendanceController");


const {
    protect
}
=
require("../middleware/authMiddleware");



// Mark attendance

router.post(
    "/mark",
    protect,
    markAttendance
);



module.exports = router;