const express = require("express");

const router = express.Router();


const {

    getMembers,

    getMemberById,

    updateMember,

    changeMemberStatus

} = require("../controllers/memberController");



const {
    protect
} = require("../middleware/authMiddleware");



const checkPermission =
require("../middleware/permissionMiddleware");





// ==========================================
// Get All Members
// GET /api/members
// ==========================================

router.get(

    "/",

    protect,

    checkPermission(
        "VIEW_MEMBERS"
    ),

    getMembers

);






// ==========================================
// Get Single Member Profile
// GET /api/members/:id
// ==========================================

router.get(

    "/:id",

    protect,

    checkPermission(
        "VIEW_PROFILE"
    ),

    getMemberById

);






// ==========================================
// Update Member
// PATCH /api/members/:id
// ==========================================

router.patch(

    "/:id",

    protect,

    checkPermission(
        "UPDATE_USER"
    ),

    updateMember

);






// ==========================================
// Change Member Status
// PATCH /api/members/:id/status
// ==========================================

router.patch(

    "/:id/status",

    protect,

    checkPermission(
        "UPDATE_USER"
    ),

    changeMemberStatus

);





module.exports = router;