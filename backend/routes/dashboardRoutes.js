const express = require("express");

const router = express.Router();


const {
    getDashboard,
    getOverview,
    getServiceDashboard
}
=
require("../controllers/dashboardController");


const {
    protect
}
=
require("../middleware/authMiddleware");




// ==========================================
// Main Dashboard
// GET /api/dashboard
// ==========================================

router.get(
    "/",
    protect,
    getDashboard
);




// ==========================================
// Church Overview
// GET /api/dashboard/overview
// ==========================================

router.get(
    "/overview",
    protect,
    getOverview
);




// ==========================================
// Service Dashboard
// GET /api/dashboard/service/:serviceId
// ==========================================

router.get(
    "/service/:serviceId",
    protect,
    getServiceDashboard
);



module.exports = router;