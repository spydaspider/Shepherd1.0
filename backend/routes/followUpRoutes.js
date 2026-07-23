const express = require("express");

const router = express.Router();


const {

    getFollowUps,

    getFollowUp,

    getPendingFollowUps,

    getCompletedFollowUps,

    updateFollowUp

} = require("../controllers/followUpController");



const {
    protect
} = require("../middleware/authMiddleware");


const checkPermission =
require("../middleware/permissionMiddleware");




// =====================================
// Get All Follow Ups
// GET /api/followup
// =====================================

router.get(

    "/",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getFollowUps

);





// =====================================
// Get Pending Follow Ups
// GET /api/followup/pending
// =====================================

router.get(

    "/pending",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getPendingFollowUps

);





// =====================================
// Get Completed Follow Ups
// GET /api/followup/completed
// =====================================

router.get(

    "/completed",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getCompletedFollowUps

);





// =====================================
// Get Single Follow Up
// GET /api/followup/:id
// =====================================

router.get(

    "/:id",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getFollowUp

);





// =====================================
// Update Follow Up
// PATCH /api/followup/:id
// =====================================

router.patch(

    "/:id",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    updateFollowUp

);



module.exports = router;