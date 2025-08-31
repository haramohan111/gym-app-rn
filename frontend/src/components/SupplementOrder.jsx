import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/features/supplement/supplementSlice";

const SupplementOrders = () => {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.supplements);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (status === "loading") return <p>Loading orders...</p>;

  return (
    <div>
      <h2>🛒 My Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.name} - ₹{order.price} | Payment ID: {order.paymentId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplementOrders;
