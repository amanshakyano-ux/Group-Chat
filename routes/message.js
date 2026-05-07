const {authenticate} = require("../middleware/auth")
const{addMessage,retrieve} = require("../controller/message")
const express = require("express")
const router = express.Router();

router.post("/send",authenticate,addMessage)
router.get("/messages",authenticate,retrieve)

module.exports = router;