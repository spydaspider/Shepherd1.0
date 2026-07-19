const express = require("express");
const router = express.Router();


const {protect} = require("../middleware/authMiddleware");

const {
    getFamily
} = require("../controllers/userController");



router.get(
"/profile",
protect,
(req,res)=>{

    res.json({

        success:true,

        user:req.user

    });

});



// Get parent + children

router.get(
"/family",
protect,
getFamily
);



module.exports = router;