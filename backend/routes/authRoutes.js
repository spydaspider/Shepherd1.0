const express = require("express");

const router = express.Router();



const {

registerUser,

loginUser,

createMemberAccount


} = require("../controllers/authController");



const {
protect
} = require("../middleware/authMiddleware");



const checkPermission =
require("../middleware/permissionMiddleware");





// =====================================
// Public Registration
// POST /api/auth/register
// =====================================

router.post(

"/register",

registerUser

);







// =====================================
// Login
// POST /api/auth/login
// =====================================

router.post(

"/login",

loginUser

);









// =====================================
// Admin Creates Login Account
// POST /api/auth/create-account/:id
// =====================================

router.post(

"/create-account/:id",

protect,

checkPermission(
"CREATE_ACCOUNT"
),

createMemberAccount

);







module.exports = router;