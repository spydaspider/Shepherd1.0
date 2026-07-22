const permissions = {

    Admin: [

        "CREATE_USER",
        "UPDATE_USER",
        "DELETE_USER",
         

        "CREATE_SERVICE",
        "END_SERVICE",
        
        "VIEW_DASHBOARD",

        "VIEW_REPORTS",

        "MANAGE_FOLLOWUPS",

        "MANAGE_DEPARTMENTS"

    ],



    Pastor: [

        "CREATE_USER",
        "UPDATE_USER",
        

        "CREATE_SERVICE",
        "END_SERVICE",

        "VIEW_DASHBOARD",

        "VIEW_REPORTS",

        "MANAGE_FOLLOWUPS"

    ],



    Leader: [

        "VIEW_DASHBOARD",

        "VIEW_REPORTS",

        "MANAGE_FOLLOWUPS",

        "VIEW_MEMBERS"

    ],



    Member: [

        "VIEW_PROFILE",

        "MARK_ATTENDANCE"

    ],



    Child: [

        "VIEW_PROFILE",

        "MARK_ATTENDANCE"

    ]

};


module.exports = permissions;