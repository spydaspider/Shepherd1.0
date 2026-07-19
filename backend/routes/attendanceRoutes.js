const express = require("express");
const router = express.Router();


const {
    generateAttendanceCode,
    markAttendance

} = require("../controllers/attendanceController");


const {
    protect
} = require("../middleware/authMiddleware");



// Generate code

router.post(
    "/generate",
    protect,
    generateAttendanceCode
);



// Mark attendance

router.post(
    "/mark",
    protect,
    markAttendance
);



module.exports = router;