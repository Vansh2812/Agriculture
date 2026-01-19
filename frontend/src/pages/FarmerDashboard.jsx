import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Package, ShoppingBag, Edit, Trash2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FarmerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'vegetables',
    price: '',
    quantity: '',
    unit: 'kg',
    location: user?.location || '',
    image_url: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`${API}/farmer/products`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'vegetables',
      price: '',
      quantity: '',
      unit: 'kg',
      location: user?.location || '',
      image_url: ''
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(
          `${API}/products/${editingProduct.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Product updated successfully!');
      } else {
        await axios.post(
          `${API}/products`,
          { ...formData, price: parseFloat(formData.price), quantity: parseFloat(formData.quantity) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Product added successfully!');
      }
      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      unit: product.unit,
      location: product.location,
      image_url: product.image_url || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API}/orders/${orderId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
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
    <div className="min-h-screen bg-[#FAF9F6] py-12" data-testid="farmer-dashboard">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2" data-testid="dashboard-title">
            Welcome, {user?.name}!
          </h1>
          <p className="text-foreground/70">Manage your products and orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white">
            <Package className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Total Products</p>
            <p className="text-3xl font-bold" data-testid="total-products">{products.length}</p>
          </Card>
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-accent to-secondary text-black">
            <ShoppingBag className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Total Orders</p>
            <p className="text-3xl font-bold" data-testid="total-orders">{orders.length}</p>
          </Card>
          <Card className="p-6 rounded-2xl border-2 border-primary/20">
            <p className="text-sm text-foreground/70 mb-1">Pending Orders</p>
            <p className="text-3xl font-bold text-primary" data-testid="pending-orders">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-semibold text-primary" data-testid="products-section-title">My Products</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="rounded-full" data-testid="add-product-button">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle data-testid="product-dialog-title">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      data-testid="product-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      data-testid="product-description-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger data-testid="product-category-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="fruits">Fruits</SelectItem>
                          <SelectItem value="grains">Grains</SelectItem>
                          <SelectItem value="dairy">Dairy</SelectItem>
                          <SelectItem value="organic">Organic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) => setFormData({ ...formData, unit: value })}
                      >
                        <SelectTrigger data-testid="product-unit-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="g">Gram (g)</SelectItem>
                          <SelectItem value="liter">Liter</SelectItem>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="dozen">Dozen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price per Unit</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        data-testid="product-price-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity Available</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        data-testid="product-quantity-input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      data-testid="product-location-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL (Optional)</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      data-testid="product-image-input"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-full" data-testid="save-product-button">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <p className="text-center text-foreground/70" data-testid="loading-indicator">Loading products...</p>
          ) : products.length === 0 ? (
            <Card className="p-12 text-center rounded-3xl" data-testid="no-products">
              <Package className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products yet</h3>
              <p className="text-foreground/70">Add your first product to start selling</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-grid">
              {products.map((product) => (
                <Card key={product.id} className="p-4 rounded-2xl hover:shadow-lg transition-all" data-testid={`product-card-${product.id}`}>
                  <div className="relative h-48 bg-accent/20 rounded-xl mb-4 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">🌾</span>
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2 capitalize">{product.category}</Badge>
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xl font-bold text-primary">{formatCurrency(product.price)}</p>
                      <p className="text-xs text-foreground/60">per {product.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{product.quantity} {product.unit}</p>
                      <p className="text-xs text-foreground/60">available</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                      data-testid={`edit-product-${product.id}`}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => handleDelete(product.id)}
                      data-testid={`delete-product-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-heading font-semibold text-primary mb-6" data-testid="orders-section-title">Orders</h2>
          {orders.length === 0 ? (
            <Card className="p-12 text-center rounded-3xl" data-testid="no-orders">
              <ShoppingBag className="h-16 w-16 mx-auto text-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-foreground/70">Orders will appear here when buyers purchase your products</p>
            </Card>
          ) : (
            <div className="space-y-4" data-testid="orders-list">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 rounded-2xl" data-testid={`order-card-${order.id}`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <Badge className={getStatusColor(order.status)} data-testid={`order-status-${order.id}`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/70">Buyer: {order.buyer_name} ({order.buyer_email})</p>
                      <p className="text-sm text-foreground/70">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary mb-2">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                            data-testid={`confirm-order-${order.id}`}
                          >
                            Confirm
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            data-testid={`deliver-order-${order.id}`}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold mb-2">Items:</p>
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-foreground/70">
                          {item.product_name} - {item.quantity} {item.unit} × {formatCurrency(item.price)} = {formatCurrency(item.total)}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-foreground/70 mt-3">
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

export default FarmerDashboard;