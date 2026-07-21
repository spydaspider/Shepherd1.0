const express = require("express");
const router = express.Router();

const {
  createService,
  getActiveService,
  endService,
  getServices,
} = require("../controllers/serviceController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Create a new service
router.post(
    "/",
    protect,
    authorizeRoles(
        "Admin",
        "Pastor",
        "Leader"
    ),
    createService
);

// Get all services
router.get("/", protect, getServices);

// Get active service
router.get("/active", protect, getActiveService);

// End a service
router.patch(
    "/:id/end",
    protect,
    authorizeRoles(
        "Admin",
        "Pastor",
        "Leader"
    ),
    endService
);
module.exports = router;