const express = require("express");

const router = express.Router();


const {

    markAttendance,

    adminMarkAttendance,

    getServiceAttendance,

    updateAttendanceStatus

} = require("../controllers/attendanceController");



const {
    protect
} = require("../middleware/authMiddleware");



const checkPermission =
require("../middleware/permissionMiddleware");





// =================================================
// Member / Parent Mark Attendance
// Members with accounts
//
// POST /api/attendance/mark
// =================================================

router.post(

    "/mark",

    protect,

    checkPermission(
        "MARK_ATTENDANCE"
    ),

    markAttendance

);








// =================================================
// Admin Mark Attendance
// Members without accounts
//
// POST /api/attendance/admin-mark
// =================================================

router.post(

    "/admin-mark",

    protect,

    checkPermission(
        "MARK_ATTENDANCE"
    ),

    adminMarkAttendance

);









// =================================================
// Get Attendance For A Service
// Admin Dashboard
//
// GET /api/attendance/service/:serviceId
// =================================================

router.get(

    "/service/:serviceId",

    protect,

    checkPermission(
        "VIEW_ATTENDANCE"
    ),

    getServiceAttendance

);








// =================================================
// Update Attendance Status
// Example:
// Change Present -> Absent
//
// PATCH /api/attendance/:id
// =================================================

router.patch(

    "/:id",

    protect,

    checkPermission(
        "UPDATE_ATTENDANCE"
    ),

    updateAttendanceStatus

);








module.exports = router;