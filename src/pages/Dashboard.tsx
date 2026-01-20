import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{ productName: string; quantity: number }>;
}

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Fetch user orders
    fetchOrders(userData.id);
  }, [navigate]);

  const fetchOrders = async (customerId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/customers/${customerId}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);

        // Calculate stats
        const totalSpent = data.reduce(
          (sum: number, order: Order) => sum + order.totalAmount,
          0
        );
        const pendingOrders = data.filter(
          (o: Order) => o.status === 'pending' || o.status === 'processing'
        ).length;
        const completedOrders = data.filter(
          (o: Order) => o.status === 'completed' || o.status === 'delivered'
        ).length;

        setStats({
          totalOrders: data.length,
          totalSpent,
          pendingOrders,
          completedOrders,
        });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartSidebar />
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.fullName?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 mt-2">Manage your orders and account</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/profile')}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Profile Settings
          </Button>
        </div>

        {/* Quick Stats */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Total Orders */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* Total Spent */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold mt-2">
                    {formatCurrency(stats.totalSpent)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            {/* Pending Orders */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pending Orders</p>
                  <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            {/* Completed Orders */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Completed</p>
                  <p className="text-3xl font-bold mt-2">{stats.completedOrders}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ChevronRight className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/order-tracking')}
            >
              Track Order
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet</p>
              <Button
                onClick={() => navigate('/shop')}
                className="mt-4"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 10).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/order-tracking?id=${order.orderNumber}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Help & Support */}
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Need Help?</h3>
              <p className="text-sm text-blue-700 mt-1">
                Can't find what you're looking for? Contact our support team via WhatsApp.
              </p>
            </div>
            <Button
              onClick={() => window.open('https://wa.me/your-whatsapp-number')}
              className="gap-2"
            >
              Contact Support
            </Button>
          </div>
        </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
