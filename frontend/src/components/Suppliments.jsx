import React from "react";
import "../styles/SupplementStore.css"; // optional for styling
import { db, auth } from "../../firebase"; // adjust path
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const supplements = [
  {
    id: 1,
    name: "Optimum Nutrition Whey Protein",
    image: "https://m.media-amazon.com/images/I/71f%2BUBXh2vL.jpg",
    price: "4,299",
    amount:"4299"
  },
  {
    id: 2,
    name: "MuscleBlaze Whey Protein",
    image: "https://m.media-amazon.com/images/I/71g532r7GpL._UY900_.jpg",
    price: "3,999",
    amount:"3999"
  },
  {
    id: 3,
    name: "Dymatize Nutrition ISO 100",
    image: "https://pescience.com/cdn/shop/files/select-protein-protein-pescience-322674.jpg?v=1715087585&width=1946",
    price: "7,499",
     amount:"7499"
  },
  {
    id: 4,
    name: "MyProtein Impact Whey",
    image: "https://www.transparentlabs.com/cdn/shop/files/TL_WPI_30S_MC_1_3_i1.png?v=1745600211",
    price:  "5,199",
     amount:"5199"
  },
  {
    id: 5,
    name: "Isopure Low Carb Whey",
    image: "https://m.media-amazon.com/images/I/61EeGF3l5LL.jpg",
    price: "8,299",
     amount:"8299"
  },
  {
    id: 6,
    name: "Ultimate Nutrition Prostar Whey",
    image: "https://m.media-amazon.com/images/I/719Y3QNZkGL._UF894%2C1000_QL80_.jpg",
    price:  "6,999",
     amount:"6999"
  },
];

const loadRazorpay = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const SupplementStore = () => {


const handleBuyNow = async (item) => {
    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Failed to load payment gateway!");
      return;
    }

    const user = auth.currentUser; // get logged-in user
    if (!user) {
      alert("Please login to purchase supplements");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: item?.amount * 100,
      currency: "INR",
      name: "Gym Supplement Store",
      description: `Purchase: ${item.name}`,
      image: "https://yourstorelogo.com/logo.png",
      handler: async function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

        try {
          await addDoc(collection(db, "supplementOrders"), {
            userId: user.uid, // ✅ Save userId
            userEmail: user.email,
            productId: item.id,
            name: item.name,
            price: item.price,
            amount: item.amount,
            paymentId: response.razorpay_payment_id,
            createdAt: serverTimestamp(),
          });
          console.log("Order stored in Firebase ✅");
        } catch (error) {
          console.error("Error saving order:", error);
        }
      },
      prefill: {
        name: user.displayName || "Customer",
        email: user.email || "customer@example.com",
        contact: user.phoneNumber || "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="supplement-store">
      <h1>💪 Supplement Store</h1>
      <div className="supplement-grid">
        {supplements.map((item) => (
          <div key={item.id} className="supplement-card">
            <img src={item.image} alt={item.name} className="supplement-img" />
            <h3>{item.name}</h3>
            <p className="price">₹{item.price}</p>
            <button className="buy-btn" onClick={() => handleBuyNow(item)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplementStore;