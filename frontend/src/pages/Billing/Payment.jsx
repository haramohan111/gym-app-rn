import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../redux/features/payment/paymentSlice";
import "./PaymentList.css";

const Payment = () => {
  const dispatch = useDispatch();
  const { payments, status, error } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  // ✅ Format Firestore timestamp or ISO string
  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.seconds) return new Date(date.seconds * 1000).toLocaleDateString();

    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "Invalid Date" : parsedDate.toLocaleDateString();
  };

  // ✅ Print single payment details
  const handlePrint = (payment) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #333; padding: 10px; text-align: left; }
          </style>
        </head>
        <body>
          <h2>Payment Receipt</h2>
          <table>
            <tr><th>Plan Duration</th><td>${payment.duration}</td></tr>
            <tr><th>Price</th><td>₹${payment.price}</td></tr>
            <tr><th>Created At</th><td>${formatDate(payment.createdAt)}</td></tr>
            <tr><th>Expire Date</th><td>${payment.expireDate || "N/A"}</td></tr>
            <tr><th>Remaining Days</th><td>${payment.remainingDays ?? "N/A"}</td></tr>
            <tr><th>Status</th><td>${payment.status === "success" ? "Paid ✅" : "Pending ⏳"}</td></tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (status === "loading") return <p>Loading payments...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  // ✅ Prepare updated payments with remainingDays
  const updatedPayments = payments.map((payment) => {
    let expireDate = "N/A";
    let remainingDays = 0;

    if (payment.createdAt && payment.duration) {
      const start = payment.createdAt.seconds
        ? new Date(payment.createdAt.seconds * 1000)
        : new Date(payment.createdAt);

      let months = 0;
      if (payment.duration.toLowerCase().includes("month")) {
        months = parseInt(payment.duration);
      } else if (payment.duration.toLowerCase().includes("year")) {
        months = 12;
      }

      const expiry = new Date(start);
      expiry.setMonth(expiry.getMonth() + months);
      expireDate = expiry.toLocaleDateString();

      const today = new Date();
      const diffTime = expiry - today;
      remainingDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    }

    return { ...payment, expireDate, remainingDays };
  });

  // ✅ Sum of all remaining days
  const totalRemainingDays = updatedPayments.reduce(
    (acc, curr) => acc + (curr.remainingDays || 0),
    0
  );

  return (
    <div className="payment-list">
      <h2>Payment List</h2>
      <table>
        <thead>
          <tr>
            <th>Plan Duration</th>
            <th>Price (₹)</th>
            <th>Created At</th>
            <th>Expire Date</th>
            <th>Remaining Days</th>
            <th>Payment Status</th>
            <th>Print</th>
          </tr>
        </thead>
        <tbody>
          {updatedPayments.length > 0 ? (
            updatedPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.duration}</td>
                <td>{payment.price}</td>
                <td>{formatDate(payment.createdAt)}</td>
                <td>{payment.expireDate}</td>
                <td>{payment.remainingDays}</td>
                <td>
                  {payment.status === "success" ? "✅ Paid" : "⏳ Pending"}
                </td>
                <td>
                  <button onClick={() => handlePrint(payment)}>🖨️ Print</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No payments found.</td>
            </tr>
          )}
        </tbody>

        {/* ✅ Show total inside table footer */}
        {updatedPayments.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan="4"><b>Total Remaining Days</b></td>
              <td><b>{totalRemainingDays}</b></td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* ✅ Or show outside table */}
      {updatedPayments.length > 0 && (
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>
          Total Remaining Days: {totalRemainingDays}
        </p>
      )}
    </div>
  );
};

export default Payment;
