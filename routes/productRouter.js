const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const thingsCtrl = require('../controllers/productsController');

router.post('/', auth, thingsCtrl.createProduct)

router.get('/', auth, thingsCtrl.getAllProducts);
router.get('/:id', auth, thingsCtrl.getProductById);

router.put('/:id', auth, thingsCtrl.updateProduct);

router.delete('/:id', auth, thingsCtrl.deleteProduct);
router.delete('/', auth, thingsCtrl.deleteManyProducts);

// router.post('/', thingsCtrl.createProduct)
//
// router.get('/', thingsCtrl.getAllProducts);
// router.get('/:id', thingsCtrl.getProductById);
//
// router.put('/:id', thingsCtrl.updateProduct);
//
// router.delete('/:id', thingsCtrl.deleteProduct);

module.exports = router;
