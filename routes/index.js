const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");


router.get('/', function(req, res, next) {
  res.sendFile(__dirname + 'htmls/index.html');
});



module.exports = router;
