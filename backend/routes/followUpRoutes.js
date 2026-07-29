const express = require("express");

const router = express.Router();



const {

    getFollowUps,

    getFollowUp,

    getPendingFollowUps,

    getCompletedFollowUps,

    getOverdueFollowUps,

    createFollowUp,

    updateFollowUp,

    getFollowUpStats


} = require("../controllers/followUpController");





const {
    protect
} = require("../middleware/authMiddleware");



const checkPermission =
require("../middleware/permissionMiddleware");







// =================================================
// Get Follow Up Statistics
// GET /api/followups/stats
// =================================================


router.get(

    "/stats",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getFollowUpStats

);









// =================================================
// Get All Follow Ups
// GET /api/followups
// =================================================


router.get(

    "/",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getFollowUps

);









// =================================================
// Get Pending Follow Ups
// GET /api/followups/pending
// =================================================


router.get(

    "/pending",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getPendingFollowUps

);









// =================================================
// Get Completed Follow Ups
// GET /api/followups/completed
// =================================================


router.get(

    "/completed",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getCompletedFollowUps

);









// =================================================
// Get Overdue Follow Ups
// GET /api/followups/overdue
// =================================================


router.get(

    "/overdue",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getOverdueFollowUps

);









// =================================================
// Create Follow Up
// POST /api/followups
// =================================================


router.post(

    "/",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    createFollowUp

);









// =================================================
// Get Single Follow Up
// GET /api/followups/:id
// =================================================


router.get(

    "/:id",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    getFollowUp

);









// =================================================
// Update Follow Up
// PATCH /api/followups/:id
// =================================================


router.patch(

    "/:id",

    protect,

    checkPermission(
        "MANAGE_FOLLOWUPS"
    ),

    updateFollowUp

);






module.exports = router;