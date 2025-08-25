import React from "react";
import "../../styles/Billing.css";

function Billing() {
  return (
    <div className="billing-page">
      {/* Invoice Header */}
      <div className="invoice-header">
        <div>
          <h1>INVOICE</h1>
          <p><strong>DATE:</strong> May 5, 2024</p>
          <p><strong>INVOICE NO:</strong> #INV-001</p>
        </div>
        <div className="invoice-logo">
          <img src="https://via.placeholder.com/80" alt="Logo" />
          <p><strong>Fitness Depot</strong></p>
          <p>Street Address</p>
          <p>City, ST ZIP Code</p>
          <p>Phone</p>
          <p>Email</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="invoice-to">
        <h4>INVOICE TO</h4>
        <p>John Doe</p>
        <p>Street Address</p>
        <p>City, ST ZIP Code</p>
        <p>Phone</p>
        <p>Email</p>
      </div>

      {/* Table Header */}
      <table className="invoice-meta">
        <thead>
          <tr>
            <th>Estimator</th>
            <th>Location</th>
            <th>Payment Terms</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Richard</td>
            <td>South Hills</td>
            <td>Due on Receipt</td>
            <td>May 5, 2024</td>
          </tr>
        </tbody>
      </table>

      {/* Item Table */}
      <table className="invoice-items">
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Unit Price</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fitness Services</td>
            <td>12 months</td>
            <td>$125/month</td>
            <td>$1500.00</td>
          </tr>
          <tr>
            <td>Online Classes</td>
            <td>12 months</td>
            <td>$10/month</td>
            <td>$120.00</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div className="invoice-totals">
        <p><strong>Subtotal:</strong> $1620.00</p>
        <p><strong>Sales Tax:</strong> $63.00</p>
        <p className="total"><strong>Total:</strong> $1683.00</p>
      </div>
    </div>
  );
}

export default Billing;
