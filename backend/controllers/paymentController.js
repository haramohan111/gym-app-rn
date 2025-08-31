const Razorpay = require("razorpay");
const crypto = require("crypto");
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,       // keep in .env
  key_secret: process.env.RAZORPAY_KEY_SECRET, // keep in .env
});

// Create order
const createOrder = async (req, res) => {
  try {
    const { amount, userId, duration } = req.body; // get extra details

    const options = {
      amount: amount * 100, // convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order to Firestore
    await db.collection("payments").doc(order.id).set({
      userId,
      duration,
      price: amount,
      orderId: order.id,
      status: "created", // initial status
      createdAt: new Date(),
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Update Firestore payment status
      await db.collection("payments").doc(razorpay_order_id).update({
        paymentId: razorpay_payment_id,
        status: "success",
        verifiedAt: new Date(),
      });

      res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      await db.collection("payments").doc(razorpay_order_id).update({
        status: "failed",
      });

      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

module.exports = { createOrder, verifyPayment };
