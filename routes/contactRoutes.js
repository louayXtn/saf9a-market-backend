// contact routes
const express = require('express');
const router = express.Router();
const { submitMessage , getMessages , deleteMessage } = require('../controllers/contactController');
const verifyJWT = require("../middleware/verifyJWT");
const verifyAdmin = require("../middleware/verifyAdmin");


    
router.route('/messages').post(verifyJWT, submitMessage);
router.route('/messages').get(verifyAdmin, getMessages);
router.route('/messages/:id').delete(verifyAdmin, deleteMessage);

module.exports = router;