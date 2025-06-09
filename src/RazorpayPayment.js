import React, { useState } from 'react';

const RazorpayPayment = ({ courseId, amount, user }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    // 1. Call backend to create order
    const orderResponse = await fetch('https://elevateu-khaki.vercel.app/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3NDgzNDQyNDIsImV4cCI6MTc0ODM0Nzg0Mn0.xfIgbZL9oU_dQzewMk1BTHVmdOlJtQcc0cNSUUzlYpo`, // Your auth token
      },
      body: JSON.stringify({ amount }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      alert('Failed to create order');
      setLoading(false);
      return;
    }

    // 2. Load Razorpay script
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Failed to load Razorpay SDK');
      setLoading(false);
      return;
    }

    // 3. Create Razorpay options object
    const options = {
      key: 'rzp_test_imrl5UK7barGAX', // Replace with your Razorpay key id
      amount: orderData.order.amount, // amount in paise
      currency: orderData.order.currency,
      name: 'EduPlatform',
      description: 'Course Payment',
      order_id: orderData.order.id,
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: '#3399cc',
      },
      handler: async function (response) {
        // 4. Verify payment on backend
        const verifyResponse = await fetch('https://elevateu-khaki.vercel.app/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3NDgzNDQyNDIsImV4cCI6MTc0ODM0Nzg0Mn0.xfIgbZL9oU_dQzewMk1BTHVmdOlJtQcc0cNSUUzlYpo`,
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            course_id: courseId,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyResponse.ok) {
          alert('Payment successful and enrolled!');
        } else {
          alert('Payment verification failed: ' + verifyData.message);
        }
      },
      modal: {
        ondismiss: function () {
          alert('Payment popup closed');
        },
      },
    };

    // 5. Open Razorpay payment form
    const rzp = new window.Razorpay(options);
    rzp.open();

    setLoading(false);
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayPayment;
