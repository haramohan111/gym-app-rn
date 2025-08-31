import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "../redux/features/plan/planSlice";
import { createOrder, verifyPayment } from "../redux/features/payment/paymentSlice";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

function MainContent() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  const { plans, loading, error } = useSelector((state) => state.plans);
  const { order } = useSelector((state) => state.payment);

  // Get userId from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? currentUser.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const loadRazorpay = async (plan) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    // 1️⃣ Create order via Redux
    const resultAction = await dispatch(
      createOrder({ amount: plan.price, userId: user, duration: plan.duration })
    );

    if (!resultAction.payload?.success) {
      alert("Order creation failed!");
      return;
    }

    // 2️⃣ Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: resultAction.payload.order.amount,
      currency: resultAction.payload.order.currency,
      name: "Gym Membership",
      description: `${plan.duration} Plan`,
      order_id: resultAction.payload.order.id,
      handler: async function (response) {
        // 3️⃣ Verify payment via Redux
        const verifyRes = await dispatch(
          verifyPayment({
            ...response,
            userId: user,
            duration: plan.duration,
          })
        );

        if (verifyRes.payload?.success) {
          alert(" Payment Successful!");
        } else {
          alert("Payment Verification Failed!");
        }
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <p>Loading plans...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="row g-3">
      {plans.map((plan) => (
        <div className="col-sm-6 col-md-4 col-lg-3" key={plan.id}>
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                {plan.duration} - ₹{plan.price}
              </h5>
              <p className="card-text">{plan.details}</p>
              <button
                className="btn btn-primary w-100"
                onClick={() => loadRazorpay(plan)}
              >
                Add Membership
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MainContent;
