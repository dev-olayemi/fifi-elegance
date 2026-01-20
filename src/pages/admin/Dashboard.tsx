import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Users, Scissors, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { bespokeApi } from '@/lib/api/bespoke';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

interface BespokeRequest {
  id: string;
  requestNumber: string;
  customer: {
    fullName: string;
  };
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bespokeRequests, setBespokeRequests] = useState<BespokeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersData, bespokeData] = await Promise.all([
        ordersApi.getAll(),
        bespokeApi.getAll(),
      ]);
      setOrders(ordersData);
      setBespokeRequests(bespokeData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'processing' || o.status === 'ready' || o.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);
  const pendingPayments = orders.filter(o => o.status === 'waiting_confirmation').length;
  const pendingPaymentsValue = orders
    .filter(o => o.status === 'waiting_confirmation')
    .reduce((sum, order) => sum + order.total, 0);
  const pendingBespoke = bespokeRequests.filter(r => r.status === 'pending').length;

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      change: `${orders.filter(o => o.status === 'delivered').length} delivered`,
      changeType: 'positive' as const,
    },
    {
      title: 'Total Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: `From ${orders.filter(o => o.status !== 'pending_payment' && o.status !== 'waiting_confirmation').length} paid orders`,
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Payments',
      value: pendingPayments.toString(),
      icon: TrendingUp,
      change: `₦${pendingPaymentsValue.toLocaleString()}`,
      changeType: pendingPayments > 0 ? 'neutral' as const : 'positive' as const,
    },
    {
      title: 'Customers',
      value: new Set(orders.map(o => o.customer.email)).size.toString(),
      icon: Users,
      change: `${totalOrders} total orders`,
      changeType: 'neutral' as const,
    },
    {
      title: 'Bespoke Requests',
      value: bespokeRequests.length.toString(),
      icon: Scissors,
      change: `${pendingBespoke} pending`,
      changeType: pendingBespoke > 0 ? 'neutral' as const : 'positive' as const,
    },
    {
      title: 'Active Orders',
      value: orders.filter(o => o.status === 'processing' || o.status === 'ready').length.toString(),
      icon: Package,
      change: 'In progress',
      changeType: 'neutral' as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1f3a]">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Fifi Fashion Wears Admin Portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1a1f3a]">{stat.value}</div>
                  <p className={`text-xs mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/fifi-admin/orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500 text-center py-8">Loading...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">#{order.orderNumber}</p>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'waiting_confirmation' ? 'outline' :
                            order.status === 'paid' || order.status === 'processing' ? 'default' :
                            'secondary'
                          } className="text-xs">
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{order.customer.fullName}</p>
                        <p className="text-xs font-semibold text-[#1a1f3a] mt-1">
                          ₦{order.total.toLocaleString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/fifi-admin/orders">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Bespoke Requests</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/fifi-admin/bespoke">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500 text-center py-8">Loading...</p>
              ) : bespokeRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bespoke requests yet</p>
              ) : (
                <div className="space-y-4">
                  {bespokeRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">#{request.requestNumber}</p>
                          <Badge variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'pending' ? 'secondary' :
                            'outline'
                          } className="text-xs">
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{request.customer.fullName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/fifi-admin/bespoke">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
