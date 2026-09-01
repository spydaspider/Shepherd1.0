const express = require("express");

const router = express.Router();


const {

    markAttendance,

    adminMarkAttendance,

    getServiceAttendance,

    getAttendanceDashboard,

    updateAttendanceStatus,

    getMyAttendanceHistory,
    
    getChildAttendanceHistory

} = require("../controllers/attendanceController");



const {
    protect
} = require("../middleware/authMiddleware");



const checkPermission =
require("../middleware/permissionMiddleware");



// =================================================
// Child Attendance History
//
// GET /api/attendance/child/:childId
// =================================================

router.get(

    "/child/:childId",

    protect,

    getChildAttendanceHistory

);

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
// Attendance Dashboard
// GET /api/attendance/dashboard
// =================================================

router.get(

    "/dashboard",

    protect,

    checkPermission(
        "VIEW_ATTENDANCE"
    ),

    getAttendanceDashboard

);


// =================================================
// Member Attendance History
//
// GET /api/attendance/my-history
// =================================================

router.get(

    "/my-history",

    protect,

    getMyAttendanceHistory

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