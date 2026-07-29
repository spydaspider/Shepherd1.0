const Notification = require("../models/Notification");





// ==========================================
// Create Notification
// POST /api/notifications
// ==========================================


const createNotification = async(req,res)=>{


try{


const {

recipient,

title,

message,

type,

relatedId

}=req.body;





if(
!recipient ||
!title ||
!message
){


return res.status(400).json({

success:false,

message:
"Recipient, title and message are required"

});


}






const notification =

await Notification.create({

recipient,

title,

message,

type:type || "General",

relatedId:relatedId || null

});






res.status(201).json({

success:true,

message:
"Notification created successfully",

notification

});




}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// Create Multiple Notifications
// Used for Service / FollowUp alerts
// POST /api/notifications/bulk
// ==========================================


const createBulkNotifications = async(req,res)=>{


try{


const notifications =
req.body.notifications;





if(
!Array.isArray(notifications) ||
notifications.length===0
){


return res.status(400).json({

success:false,

message:
"Notifications array required"

});


}







const created =

await Notification.insertMany(
notifications
);






res.status(201).json({

success:true,

message:
"Notifications created successfully",

count:
created.length,

notifications:
created

});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// Get My Notifications
// GET /api/notifications
// ==========================================


const getNotifications = async(req,res)=>{


try{


const page =
Number(req.query.page) || 1;


const limit =
Number(req.query.limit) || 20;


const skip =
(page-1)*limit;







const [

notifications,

total,

unreadCount


]=await Promise.all([



Notification.find({

recipient:req.user._id

})

.sort({

createdAt:-1

})

.skip(skip)

.limit(limit),





Notification.countDocuments({

recipient:req.user._id

}),





Notification.countDocuments({

recipient:req.user._id,

isRead:false

})


]);








res.json({

success:true,


page,

limit,


total,


unreadCount,


notifications


});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// Get Unread Notifications
// GET /api/notifications/unread
// ==========================================


const getUnreadNotifications = async(req,res)=>{


try{


const notifications =

await Notification.find({

recipient:req.user._id,

isRead:false

})

.sort({

createdAt:-1

});







res.json({

success:true,

count:
notifications.length,

notifications

});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// Mark Notification As Read
// PATCH /api/notifications/:id/read
// ==========================================


const markAsRead = async(req,res)=>{


try{


const notification =

await Notification.findOne({

_id:req.params.id,

recipient:req.user._id

});






if(!notification){


return res.status(404).json({

success:false,

message:
"Notification not found"

});


}








if(notification.isRead){


return res.json({

success:true,

message:
"Already marked as read",

notification

});


}







notification.isRead=true;

notification.readAt=new Date();


await notification.save();








res.json({

success:true,

message:
"Notification marked as read",

notification

});




}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// Mark All As Read
// PATCH /api/notifications/read-all
// ==========================================


const markAllAsRead = async(req,res)=>{


try{


await Notification.updateMany(

{

recipient:req.user._id,

isRead:false

},

{

isRead:true,

readAt:new Date()

}

);





res.json({

success:true,

message:
"All notifications marked as read"

});




}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









// ==========================================
// Delete Notification
// DELETE /api/notifications/:id
// ==========================================


const deleteNotification = async(req,res)=>{


try{


const notification =

await Notification.findOne({

_id:req.params.id,

recipient:req.user._id

});






if(!notification){


return res.status(404).json({

success:false,

message:
"Notification not found"

});


}






await notification.deleteOne();






res.json({

success:true,

message:
"Notification deleted successfully"

});



}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};









module.exports={


createNotification,

createBulkNotifications,

getNotifications,

getUnreadNotifications,

markAsRead,

markAllAsRead,

deleteNotification


};