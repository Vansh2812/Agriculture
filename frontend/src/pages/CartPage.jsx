import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { Trash2, ShoppingBag } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartPage = () => {
  const { user, token } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        total: item.price * item.quantity
      }));

      await axios.post(
        `${API}/orders`,
        {
          items: orderItems,
          delivery_address: deliveryAddress,
          payment_method: 'COD'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/buyer-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] py-12" data-testid="empty-cart">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-foreground/30 mb-4" />
          <h2 className="text-3xl font-heading font-bold text-primary mb-4">Your Cart is Empty</h2>
          <p className="text-foreground/70 mb-8">Add some products to get started</p>
          <Button onClick={() => navigate('/products')} className="rounded-full" data-testid="browse-products-button">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8" data-testid="cart-title">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 rounded-2xl" data-testid={`cart-item-${item.id}`}>
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-accent/20 flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">🌾</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-foreground/70 mb-2">{item.farmer_name}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          data-testid={`decrease-quantity-${item.id}`}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center" data-testid={`item-quantity-${item.id}`}>{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid={`increase-quantity-${item.id}`}
                        >
                          +
                        </Button>
                      </div>
                      <span className="text-foreground/70">{item.unit}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <p className="text-xl font-bold text-primary" data-testid={`item-total-${item.id}`}>
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeFromCart(item.id)}
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 rounded-2xl sticky top-24">
              <h2 className="font-heading text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span data-testid="cart-subtotal">{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary" data-testid="cart-total">{formatCurrency(getCartTotal())}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    className="mt-1"
                    rows={4}
                    data-testid="delivery-address-input"
                  />
                </div>
                <div className="bg-accent/10 p-4 rounded-xl">
                  <p className="text-sm font-semibold mb-1">Payment Method</p>
                  <p className="text-sm text-foreground/70">Cash on Delivery (COD)</p>
                </div>
              </div>

              <Button
                className="w-full rounded-full"
                size="lg"
                onClick={handleCheckout}
                disabled={loading}
                data-testid="checkout-button"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;