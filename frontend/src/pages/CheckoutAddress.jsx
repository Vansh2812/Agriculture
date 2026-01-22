import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { product, quantity } = state || {};

  const [address, setAddress] = useState("");

  if (!product) return <p>Invalid checkout</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <Card className="p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Delivery Address</h2>

        <Label>Full Address</Label>
        <Input
          placeholder="House no, Street, City, Pincode"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Button
          className="w-full"
          onClick={() =>
            navigate("/checkout/payment", {
              state: { product, quantity, address },
            })
          }
        >
          Continue to Payment
        </Button>
      </Card>
    </div>
  );
};

export default CheckoutAddress;
