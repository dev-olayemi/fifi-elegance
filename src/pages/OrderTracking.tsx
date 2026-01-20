import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Package, CheckCircle, Truck, Home } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orders = await ordersApi.getAll();
      const foundOrder = orders.find((o: any) => o.orderNumber === orderNumber.toUpperCase());
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast({
          title: 'Order Not Found',
          description: 'No order found with this number. Please check and try again.',
          variant: 'destructive',
        });
        setOrder(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: any = {
      pending_payment: {
        label: 'Pending Payment',
        icon: Package,
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Waiting for payment confirmation',
      },
      waiting_confirmation: {
        label: 'Waiting Confirmation',
        icon: Package,
        color: 'bg-blue-100 text-blue-800',
        description: 'Payment received, awaiting confirmation',
      },
      paid: {
        label: 'Payment Confirmed',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        description: 'Payment confirmed, preparing your order',
      },
      processing: {
        label: 'Processing',
        icon: Package,
        color: 'bg-purple-100 text-purple-800',
        description: 'Your order is being prepared',
      },
      ready: {
        label: 'Ready for Delivery',
        icon: Truck,
        color: 'bg-indigo-100 text-indigo-800',
        description: 'Your order is ready to be shipped',
      },
      delivered: {
        label: 'Delivered',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800',
        description: 'Your order has been delivered',
      },
      cancelled: {
        label: 'Cancelled',
        icon: Package,
        color: 'bg-red-100 text-red-800',
        description: 'This order has been cancelled',
      },
    };

    return statusMap[status] || statusMap.pending_payment;
  };

  const statusInfo = order ? getStatusInfo(order.status) : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a1f3a] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center">
                <span className="text-lg font-serif font-bold text-[#1a1f3a]">FF</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-xl">Fifi Fashion Wears</h1>
                <p className="text-xs text-gray-300">LE LUXE Collection</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-[#2a2f4a]">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-[#1a1f3a]">
                Track Your Order
              </CardTitle>
              <CardDescription>
                Enter your order number to check the status of your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="orderNumber"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g., ORD000001"
                      required
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {loading ? 'Searching...' : 'Track'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    You can find your order number in the confirmation email
                  </p>
                </div>
              </form>

              {order && (
                <div className="mt-8 space-y-6">
                  {/* Order Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {StatusIcon && (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusInfo.color}`}>
                          <StatusIcon className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{statusInfo.label}</h3>
                        <p className="text-sm text-gray-600">{statusInfo.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-semibold">{order.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold text-[#1a1f3a]">
                          ₦{order.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div>
                    <h3 className="font-semibold mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span>{order.customer.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>{order.customer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>{order.customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      Need help with your order? Contact us on WhatsApp:
                    </p>
                    <Button
                      className="mt-2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        const message = `Hello, I need help with my order ${order.orderNumber}`;
                        window.open(`https://wa.me/2348122815425?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      Chat on WhatsApp
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
