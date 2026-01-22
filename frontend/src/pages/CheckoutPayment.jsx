import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";

const API = "http://127.0.0.1:8000/api";

const CheckoutPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [method, setMethod] = useState("cod");

  const { product, quantity, address } = state;

  const baseAmount = product.price * quantity;
  const totalAmount = method === "cod" ? baseAmount + 40 : baseAmount;

  // ================= COD =================
  const placeOrderCOD = async () => {
    try {
      await axios.post(
        `${API}/orders`,
        {
          items: [
            {
              product_id: product.id,
              product_name: product.name,
              quantity,
              unit: product.unit,
              price: product.price,
              total: baseAmount,
            },
          ],
          delivery_address: address,
          payment_method: "cod",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order placed (COD)");
      navigate("/orders");
    } catch {
      toast.error("Order failed");
    }
  };

  // ================= RAZORPAY =================
  const payWithRazorpay = async () => {
    try {
      const res = await axios.post(
        `${API}/payments/create-order`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: "INR",
        name: "Agriculture Market",
        description: "Order Payment",
        order_id: res.data.order_id,
        handler: async function (response) {
          await axios.post(
            `${API}/payments/verify`,
            response,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // create order after payment
          await placeOrderOnline();
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#4CAF50",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  const placeOrderOnline = async () => {
    await axios.post(
      `${API}/orders`,
      {
        items: [
          {
            product_id: product.id,
            product_name: product.name,
            quantity,
            unit: product.unit,
            price: product.price,
            total: baseAmount,
          },
        ],
        delivery_address: address,
        payment_method: "online",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Payment successful & Order placed");
    navigate("/orders");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <Card className="p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Payment</h2>

        <label>
          <input
            type="radio"
            checked={method === "cod"}
            onChange={() => setMethod("cod")}
          />{" "}
          Cash on Delivery (+₹40)
        </label>

        <label>
          <input
            type="radio"
            checked={method === "online"}
            onChange={() => setMethod("online")}
          />{" "}
          Online Payment (Razorpay)
        </label>

        <p className="font-semibold">
          Total: {formatCurrency(totalAmount)}
        </p>

        {method === "cod" ? (
          <Button className="w-full" onClick={placeOrderCOD}>
            Place Order
          </Button>
        ) : (
          <Button className="w-full" onClick={payWithRazorpay}>
            Pay with Razorpay
          </Button>
        )}
      </Card>
    </div>
  );
};

export default CheckoutPayment;
