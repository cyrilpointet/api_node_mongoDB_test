const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const memberCtrl = require('../controllers/groupsController');

router.get('/', auth, memberCtrl.getAllGroups);
router.get('/:id', auth, memberCtrl.getGroupById);

module.exports = router;
