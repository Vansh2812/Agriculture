import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { MapPin, User, ShoppingCart } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user.role !== 'buyer') {
      toast.error('Only buyers can add items to cart');
      return;
    }

    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-indicator">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="product-not-found">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

          <div className="space-y-6">
            <div>
              <Badge className="mb-4 capitalize">{product.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4" data-testid="product-title">
                {product.name}
              </h1>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            <Card className="p-6 bg-accent/10 border-accent/30">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-primary" data-testid="product-detail-price">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-foreground/60">per {product.unit}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground/70">
                  <User className="h-4 w-4" />
                  <span>Farmer: <strong>{product.farmer_name}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <MapPin className="h-4 w-4" />
                  <span>Location: <strong>{product.location}</strong></span>
                </div>
                <div className="text-foreground/70">
                  Available: <strong>{product.quantity} {product.unit}</strong>
                </div>
              </div>
            </Card>

            {user?.role === 'buyer' && (
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
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="mt-1"
                      data-testid="quantity-input"
                    />
                  </div>
                  <Button
                    className="w-full rounded-full"
                    size="lg"
                    onClick={handleAddToCart}
                    data-testid="add-to-cart-button"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            )}

            {!user && (
              <Card className="p-6 text-center">
                <p className="text-foreground/70 mb-4">Login to purchase this product</p>
                <Button className="rounded-full" onClick={() => navigate('/login')} data-testid="login-to-buy-button">
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