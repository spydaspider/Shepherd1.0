const express = require("express");

const router = express.Router();

const {
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



router.get(
"/overview",
protect,
getOverview
);



router.get(
"/service/:serviceId",
protect,
getServiceDashboard
);



module.exports = router;