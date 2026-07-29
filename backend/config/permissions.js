const permissions = {


    Admin:[


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




        // Dashboard

        "VIEW_DASHBOARD",
        "VIEW_REPORTS",




        // Follow Ups

        "MANAGE_FOLLOWUPS",




        // Management

        "MANAGE_DEPARTMENTS",
        "MANAGE_NOTIFICATIONS"


    ],







    Pastor:[


        "CREATE_USER",
        "UPDATE_USER",


        "VIEW_MEMBERS",
        "VIEW_PROFILE",



        "CREATE_SERVICE",
        "END_SERVICE",
        "VIEW_SERVICES",



        "MARK_ATTENDANCE",
        "VIEW_ATTENDANCE",



        "VIEW_DASHBOARD",
        "VIEW_REPORTS",



        "MANAGE_FOLLOWUPS",


        "MANAGE_NOTIFICATIONS"


    ],







    Leader:[


        "CREATE_USER",
        "UPDATE_USER",


        "VIEW_MEMBERS",
        "VIEW_PROFILE",



        "VIEW_SERVICES",



        "MARK_ATTENDANCE",
        "VIEW_ATTENDANCE",



        "VIEW_DASHBOARD",



        "MANAGE_FOLLOWUPS"


    ],







    Member:[


        "VIEW_PROFILE",

        "MARK_ATTENDANCE"


    ],







    Child:[


        "VIEW_PROFILE",

        "MARK_ATTENDANCE"


    ]

};









// ==========================================
// Permission Checker
// ==========================================

const hasPermission = (

    role,

    permission

)=>{


    return (

        permissions[role] || []

    )

    .includes(permission);


};









module.exports={

    permissions,

    hasPermission

};