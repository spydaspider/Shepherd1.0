const express = require("express");

const router = express.Router();


const {
    markAttendance
} = require("../controllers/attendanceController");



const {
    protect
} = require("../middleware/authMiddleware");



const checkPermission =
require("../middleware/permissionMiddleware");




// ==========================================
// Mark Attendance
// POST /api/attendance/mark
// ==========================================

router.post(

    "/mark",

    protect,

    checkPermission(
        "MARK_ATTENDANCE"
    ),

    markAttendance

);



module.exports = router;