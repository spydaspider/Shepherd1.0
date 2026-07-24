const Attendance = require("../models/Attendance");
const Service = require("../models/Service");
const User = require("../models/User");


// =======================================
// Get Attendance Report For A Service
// GET /api/attendance/report/:serviceId
// =======================================

// ==========================================
// Attendance Report
// GET /api/reports/attendance/:serviceId
// ==========================================

const getAttendanceReport = async (req, res) => {
    try {

        const service = await Service.findById(req.params.serviceId);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // All active members
        const allMembers = await User.find({ isActive: true })
            .select("firstName lastName gender isChild phone");

        // Attendance records
        const attendance = await Attendance.find({
            service: service._id
        })
        .populate(
            "user",
            "firstName lastName gender isChild phone"
        );

        // Present member IDs
        const presentIds = attendance.map(record =>
            record.user._id.toString()
        );

        // Present members
        const presentMembers = attendance.map(record => ({
            id: record.user._id,
            firstName: record.user.firstName,
            lastName: record.user.lastName,
            phone: record.user.phone,
            gender: record.user.gender,
            isChild: record.user.isChild,
            attendanceMethod: record.attendanceMethod,
            status: record.status
        }));

        // Absent members
        const absentMembers = allMembers
            .filter(member =>
                !presentIds.includes(member._id.toString())
            )
            .map(member => ({
                id: member._id,
                firstName: member.firstName,
                lastName: member.lastName,
                phone: member.phone,
                gender: member.gender,
                isChild: member.isChild
            }));

        const totalMembers = allMembers.length;
        const present = presentMembers.length;
        const absent = absentMembers.length;

        const adults = presentMembers.filter(m => !m.isChild).length;
        const children = presentMembers.filter(m => m.isChild).length;
        const male = presentMembers.filter(m => m.gender === "Male").length;
        const female = presentMembers.filter(m => m.gender === "Female").length;

        const attendanceRate =
            totalMembers > 0
                ? Number(((present / totalMembers) * 100).toFixed(2))
                : 0;

        res.json({
            success: true,

            report: {

                service: {
                    id: service._id,
                    name: service.name,
                    serviceType: service.serviceType,
                    serviceDate: service.serviceDate
                },

                summary: {
                    totalMembers,
                    present,
                    absent,
                    attendanceRate,
                    adults,
                    children,
                    male,
                    female
                },

                presentMembers,

                absentMembers

            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {

    getAttendanceReport

};