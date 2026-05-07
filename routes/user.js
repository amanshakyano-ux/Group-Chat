const express = require("express")
const router = express.Router();
const {signup,login,tokenDecode} = require("../controller/user")
const {authenticate} = require("../middleware/auth")

router.post("/signup",signup)
router.post("/login",login)
router.get("/getUserId",authenticate,tokenDecode)




module.exports = router;
