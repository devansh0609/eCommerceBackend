const express = require('express');
const router = express.Router();
const myController = require('../Controllers/Controller');

router.post('/user_register', myController.getRegData);
router.post('/user_login', myController.loginData);
router.get('/products',myController.productFetch);
router.post('/addToCart',myController.cartAddData);
router.get('/fetchCart',myController.cartFetch);
router.post('/decProd',myController.decProd);
router.post('/removeProd',myController.removeProd);

module.exports = router;