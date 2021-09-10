const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const memberCtrl = require('../controllers/membersController');

router.get('/', auth, memberCtrl.getAllMembers);
router.get('/:id', auth, memberCtrl.getMemberById);

module.exports = router;
