const FollowUp = require("../models/FollowUp");



// =====================================
// Get All Follow Ups
// GET /api/followups
// =====================================

const getFollowUps = async (req, res) => {

    try {

        let query = {};

        // Leaders only see follow-ups assigned to them
        if (
            req.user.role !== "Admin" &&
            req.user.role !== "Pastor"
        ) {

            query.assignedTo = req.user._id;

        }

        const followUps = await FollowUp.find(query)

            .populate(
                "member",
                "firstName lastName phone"
            )

            .populate(
                "assignedTo",
                "firstName lastName role"
            )

            .populate(
                "service",
                "name serviceDate"
            )

            .sort({
                createdAt: -1
            });

        res.json({

            success: true,

            count: followUps.length,

            followUps

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// =====================================
// Get Single Follow Up
// GET /api/followups/:id
// =====================================

const getFollowUp = async (req, res) => {

    try {

        const followUp = await FollowUp.findById(req.params.id)

            .populate(
                "member"
            )

            .populate(
                "assignedTo",
                "firstName lastName role"
            )

            .populate(
                "service"
            );

        if (!followUp) {

            return res.status(404).json({

                success: false,

                message: "Follow up not found"

            });

        }

        res.json({

            success: true,

            followUp

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// =====================================
// Get Pending Follow Ups
// GET /api/followups/pending
// =====================================

const getPendingFollowUps = async (req, res) => {

    try {

        let query = {

            status: "Pending"

        };

        if (
            req.user.role !== "Admin" &&
            req.user.role !== "Pastor"
        ) {

            query.assignedTo = req.user._id;

        }

        const followUps = await FollowUp.find(query)

            .populate(
                "member",
                "firstName lastName phone"
            )

            .populate(
                "assignedTo",
                "firstName lastName"
            )

            .populate(
                "service",
                "name serviceDate"
            )

            .sort({
                createdAt: -1
            });

        res.json({

            success: true,

            count: followUps.length,

            followUps

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// =====================================
// Get Completed Follow Ups
// GET /api/followups/completed
// =====================================

const getCompletedFollowUps = async (req, res) => {

    try {

        let query = {

            status: "Completed"

        };

        if (
            req.user.role !== "Admin" &&
            req.user.role !== "Pastor"
        ) {

            query.assignedTo = req.user._id;

        }

        const followUps = await FollowUp.find(query)

            .populate(
                "member",
                "firstName lastName phone"
            )

            .populate(
                "assignedTo",
                "firstName lastName"
            )

            .populate(
                "service",
                "name serviceDate"
            )

            .sort({
                createdAt: -1
            });

        res.json({

            success: true,

            count: followUps.length,

            followUps

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// =====================================
// Update Follow Up
// PATCH /api/followups/:id
// =====================================

const updateFollowUp = async (req, res) => {

    try {

        const followUp = await FollowUp.findById(
            req.params.id
        );

        if (!followUp) {

            return res.status(404).json({

                success: false,

                message: "Follow up not found"

            });

        }

        followUp.status =
            req.body.status ??
            followUp.status;

        followUp.notes =
            req.body.notes ??
            followUp.notes;

        // Record the first time contact is made
        if (
            req.body.status === "Contacted" ||
            req.body.status === "Completed"
        ) {

            followUp.contactedDate = new Date();

        }

        await followUp.save();

        res.json({

            success: true,

            message: "Follow up updated successfully",

            followUp

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



module.exports = {

    getFollowUps,

    getFollowUp,

    getPendingFollowUps,

    getCompletedFollowUps,

    updateFollowUp

};