import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { MapPin, User, ShoppingCart } from "lucide-react";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { productId } = useParams(); // ✅ FIXED
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to fetch product", error);
      toast.error("Product not found");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (user.role !== "buyer") {
      toast.error("Only buyers can add items to cart");
      return;
    }

    addToCart(product, quantity);
    toast.success("Added to cart!");
  };

  // ================= UI STATES =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* IMAGE */}
          <div>
            <div className="rounded-3xl overflow-hidden bg-white shadow-lg">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
              ) : (
                <div className="w-full h-[500px] flex items-center justify-center bg-accent/20">
                  <span className="text-9xl">🌾</span>
                </div>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-4 capitalize">{product.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-foreground/70">
                {product.description}
              </p>
            </div>

            <Card className="p-6 bg-accent/10 border-accent/30">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-foreground/60">per {product.unit}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground/70">
                  <User className="h-4 w-4" />
                  <span>
                    Farmer: <strong>{product.farmer_name}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <MapPin className="h-4 w-4" />
                  <span>
                    Location: <strong>{product.location}</strong>
                  </span>
                </div>
                <div className="text-foreground/70">
                  Available:{" "}
                  <strong>
                    {product.quantity} {product.unit}
                  </strong>
                </div>
              </div>
            </Card>

            {/* BUYER ACTION */}
            {user?.role === "buyer" && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Quantity ({product.unit})</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    className="w-full rounded-full"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    size="lg"
                    onClick={() =>
                      navigate("/checkout/address", {
                        state: {
                          product,
                          quantity,
                        },
                      })
                    }
                  >
                    Buy Now
                  </Button>
                </div>
              </Card>
            )}

            {/* NOT LOGGED IN */}
            {!user && (
              <Card className="p-6 text-center">
                <p className="text-foreground/70 mb-4">
                  Login to purchase this product
                </p>
                <Button
                  className="rounded-full"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
