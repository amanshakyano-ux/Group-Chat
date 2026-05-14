const {authenticate} = require("../middleware/auth")
const{addMessage,retrieve,addFile} = require("../controller/message")
const express = require("express")
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})

const router = express.Router();

router.post("/send",authenticate,addMessage)
router.get("/messages",authenticate,retrieve)
router.post("/upload-media",authenticate,upload.single("media"),addFile)

module.exports = router;