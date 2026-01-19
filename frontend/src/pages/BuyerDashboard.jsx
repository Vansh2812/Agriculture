import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Package, ShoppingBag, User } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BuyerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12" data-testid="buyer-dashboard">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2" data-testid="dashboard-title">
            Welcome, {user?.name}!
          </h1>
          <p className="text-foreground/70">Manage your orders and profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white">
            <Package className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Total Orders</p>
            <p className="text-3xl font-bold" data-testid="total-orders">{orders.length}</p>
          </Card>
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-accent to-secondary text-black">
            <ShoppingBag className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Pending Orders</p>
            <p className="text-3xl font-bold" data-testid="pending-orders">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </Card>
          <Card className="p-6 rounded-2xl border-2 border-primary/20 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/products')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/70 mb-1">Browse More</p>
                <p className="text-xl font-semibold text-primary">Products</p>
              </div>
              <Button size="sm" className="rounded-full" data-testid="browse-products-button">
                Browse
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-heading font-semibold text-primary mb-6" data-testid="orders-section-title">My Orders</h2>
          {loading ? (
            <p className="text-center text-foreground/70" data-testid="loading-indicator">Loading orders...</p>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center rounded-3xl" data-testid="no-orders">
              <Package className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-foreground/70 mb-6">Start shopping to place your first order</p>
              <Button onClick={() => navigate('/products')} className="rounded-full">
                Browse Products
              </Button>
            </Card>
          ) : (
            <div className="space-y-4" data-testid="orders-list">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 rounded-2xl hover:shadow-lg transition-all" data-testid={`order-card-${order.id}`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <Badge className={getStatusColor(order.status)} data-testid={`order-status-${order.id}`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/70 mb-1">
                        Farmer: {order.farmer_name}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {order.items.length} item(s) • {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary mb-2" data-testid={`order-total-${order.id}`}>
                        {formatCurrency(order.total_amount)}
                      </p>
                      <p className="text-xs text-foreground/60">{order.payment_method}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-foreground/70">
                      <strong>Delivery Address:</strong> {order.delivery_address}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;