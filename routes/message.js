const {authenticate} = require("../middleware/auth")
const{addMessage} = require("../controller/message")
const express = require("express")
const router = express.Router();

router.post("/send",authenticate,addMessage)

module.exports = router;