import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch the client secret from Laravel backend
        axios.post("http://192.168.137.160/api/payment", {
            amount: 5000, // 50 USD (Stripe uses cents)
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => setMessage(err.response?.data?.error || "Something went wrong"));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!stripe || !elements || !clientSecret) {
            setMessage("Stripe is not loaded yet. Please try again.");
            setLoading(false);
            return;
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: elements.getElement(CardElement) },
        });

        if (error) {
            setMessage(error.message);
        } else if (paymentIntent.status === "succeeded") {
            setMessage("✅ Payment successful!");
        }

        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h2>Stripe Payment</h2>
            <form onSubmit={handleSubmit}>
                <CardElement options={{ hidePostalCode: true }} />
                <button type="submit" disabled={loading || !clientSecret} style={{ marginTop: "10px", padding: "10px" }}>
                    {loading ? "Processing..." : "Pay $50"}
                </button>
            </form>
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
    );
};

export default PaymentForm;
