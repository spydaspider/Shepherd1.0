const express = require("express");

const router = express.Router();


const {

    getFollowUps,

    getFollowUp,

    createFollowUp,

    updateFollowUp,

    getFollowUpStats


} = require("../controllers/followUpController");



const {
    protect
} = require("../middleware/authMiddleware");



const checkPermission =
require("../middleware/permissionMiddleware");






router.get(

"/stats",

protect,

checkPermission(
"MANAGE_FOLLOWUPS"
),

getFollowUpStats

);







router.get(

"/",

protect,

checkPermission(
"MANAGE_FOLLOWUPS"
),

getFollowUps

);







router.get(

"/:id",

protect,

checkPermission(
"MANAGE_FOLLOWUPS"
),

getFollowUp

);







router.post(

"/",

protect,

checkPermission(
"MANAGE_FOLLOWUPS"
),

createFollowUp

);







router.patch(

"/:id",

protect,

checkPermission(
"MANAGE_FOLLOWUPS"
),

updateFollowUp

);






module.exports = router;