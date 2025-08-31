// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();

const { createOrder, verifyPayment }  = require("../controllers/paymentController.js");


router.post("/payment/create-order", createOrder);
router.post("/payment/verify-payment", verifyPayment);

module.exports = router;
