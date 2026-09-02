const permissions = {

    // =====================================================
    // ADMIN
    // =====================================================

    Admin: [

        // Users
        "CREATE_USER",
        "UPDATE_USER",
        "DELETE_USER",

        "VIEW_MEMBERS",
        "VIEW_PROFILE",

        // Services
        "CREATE_SERVICE",
        "END_SERVICE",
        "VIEW_SERVICES",

        // Attendance
        "MARK_ATTENDANCE",
        "VIEW_ATTENDANCE",
        "VIEW_ATTENDANCE_REPORT",

        // Dashboard
        "VIEW_DASHBOARD",
        "VIEW_REPORTS",

        // Follow Ups
        "MANAGE_FOLLOWUPS",

        // Management
        "MANAGE_DEPARTMENTS",
        "MANAGE_NOTIFICATIONS"

    ],


    // =====================================================
    // PASTOR
    // =====================================================

    Pastor: [

        // Users
        "CREATE_USER",
        "UPDATE_USER",

        "VIEW_MEMBERS",
        "VIEW_PROFILE",

        // Services
        "CREATE_SERVICE",
        "END_SERVICE",
        "VIEW_SERVICES",

        // Attendance
        "MARK_ATTENDANCE",
        "VIEW_ATTENDANCE",
        "VIEW_ATTENDANCE_REPORT",

        // Dashboard
        "VIEW_DASHBOARD",
        "VIEW_REPORTS",

        // Follow Ups
        "MANAGE_FOLLOWUPS",

        // Notifications
        "MANAGE_NOTIFICATIONS"

    ],


    // =====================================================
    // SECRETARY
    // =====================================================

    Secretary: [

        // Users
        "VIEW_MEMBERS",
        "VIEW_PROFILE",

        // Services
        "VIEW_SERVICES",

        // Attendance
        "VIEW_ATTENDANCE",
        "VIEW_ATTENDANCE_REPORT",

        // Dashboard
        "VIEW_DASHBOARD",

        // Reports
        "VIEW_REPORTS"

    ],


    // =====================================================
    // LEADER
    // =====================================================

    Leader: [

        // Users
        "CREATE_USER",
        "UPDATE_USER",

        "VIEW_MEMBERS",
        "VIEW_PROFILE",

        // Services
        "VIEW_SERVICES",

        // Attendance
        "MARK_ATTENDANCE",
        "VIEW_ATTENDANCE",

        // Dashboard
        "VIEW_DASHBOARD",

        // Follow Ups
        "MANAGE_FOLLOWUPS"

    ],


    // =====================================================
    // MEMBER
    // =====================================================

    Member: [

        "VIEW_PROFILE",

        "MARK_ATTENDANCE"

    ],


    // =====================================================
    // CHILD
    // =====================================================

    Child: [

        "VIEW_PROFILE",

        "MARK_ATTENDANCE"

    ]

};


// =====================================================
// PERMISSION CHECKER
// =====================================================

const hasPermission = (

    role,

    permission

) => {

    return (

        permissions[role] || []

    ).includes(permission);

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    permissions,

    hasPermission

};