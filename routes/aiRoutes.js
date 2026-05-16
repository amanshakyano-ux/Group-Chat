const express = require("express")
const router = express.Router();
const{replies,suggestions}= require("../controller/aiController")

router.post("/suggestions", suggestions);

router.post("/replies", replies);

module.exports = router;
