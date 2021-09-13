const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const groupCtrl = require('../controllers/groupsController');

router.get('/', auth, groupCtrl.getAllGroups);
router.get('/:id', auth, groupCtrl.getGroupById);
router.delete('/:id', auth, groupCtrl.deleteGroup);

module.exports = router;
