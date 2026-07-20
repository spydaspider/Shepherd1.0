const express = require("express");

const router = express.Router();


const {
    getDashboardStats
}
=
require("../controllers/dashboardController");


const {
    protect
}
=
require("../middleware/authMiddleware");


const authorizeRoles =
require("../middleware/roleMiddleware");



router.get(
"/",
protect,
authorizeRoles(
    "Admin",
    "Pastor",
    "Leader"
),
getDashboardStats
);



module.exports = router;