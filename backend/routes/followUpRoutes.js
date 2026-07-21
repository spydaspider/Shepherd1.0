const express = require("express");

const router = express.Router();


const {

createFollowUp,

getFollowUps,

updateFollowUp

}
=
require("../controllers/followUpController");


const {

protect

}
=
require("../middleware/authMiddleware");



router.post(
"/",
protect,
createFollowUp
);



router.get(
"/",
protect,
getFollowUps
);



router.put(
"/:id",
protect,
updateFollowUp
);



module.exports = router;