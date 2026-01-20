import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ordersApi } from '@/lib/api/orders';
import { useToast } from '@/hooks/use-toast';
import { Eye, CheckCircle, Package, Truck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      toast({
        title: 'Status Updated',
        description: 'Order status has been updated successfully',
      });
      loadOrders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmPayment = async (orderId: string) => {
    try {
      await ordersApi.confirmPayment(orderId);
      toast({
        title: 'Payment Confirmed',
        description: 'Payment has been confirmed successfully',
      });
      loadOrders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to confirm payment',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending_payment: 'secondary',
      waiting_confirmation: 'outline',
      paid: 'default',
      processing: 'default',
      ready: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    };

    const labels: any = {
      pending_payment: 'Pending Payment',
      waiting_confirmation: 'Waiting Confirmation',
      paid: 'Paid',
      processing: 'Processing',
      ready: 'Ready',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const filterOrders = (status?: string) => {
    if (!status) return orders;
    return orders.filter((order) => order.status === status);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">#{order.orderNumber}</h3>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-sm text-gray-600">
              <strong>Customer:</strong> {order.customer.fullName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {order.customer.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Phone:</strong> {order.customer.phone}
            </p>
            <p className="text-sm font-semibold text-[#1a1f3a]">
              Total: ₦{order.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedOrder(order);
                setIsDetailOpen(true);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {order.status === 'waiting_confirmation' && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleConfirmPayment(order.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Confirm
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1f3a]">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders and payments</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Payment ({filterOrders('pending_payment').length})
            </TabsTrigger>
            <TabsTrigger value="waiting">
              Waiting Confirmation ({filterOrders('waiting_confirmation').length})
            </TabsTrigger>
            <TabsTrigger value="paid">Paid ({filterOrders('paid').length})</TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({filterOrders('processing').length})
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Delivered ({filterOrders('delivered').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div>
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {filterOrders('pending_payment').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No pending payment orders</p>
              </div>
            ) : (
              <div>
                {filterOrders('pending_payment').map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="waiting" className="mt-6">
            {filterOrders('waiting_confirmation').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No orders waiting confirmation</p>
              </div>
            ) : (
              <div>
                {filterOrders('waiting_confirmation').map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="paid" className="mt-6">
            {filterOrders('paid').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No paid orders</p>
              </div>
            ) : (
              <div>
                {filterOrders('paid').map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="processing" className="mt-6">
            {filterOrders('processing').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No orders in processing</p>
              </div>
            ) : (
              <div>
                {filterOrders('processing').map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivered" className="mt-6">
            {filterOrders('delivered').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No delivered orders</p>
              </div>
            ) : (
              <div>
                {filterOrders('delivered').map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Order Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-[#1a1f3a]">
                Order Details
              </DialogTitle>
              <DialogDescription>
                {selectedOrder && `Order #${selectedOrder.orderNumber}`}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                    <p><strong>Name:</strong> {selectedOrder.customer.fullName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Status</h3>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending_payment">Pending Payment</SelectItem>
                      <SelectItem value="waiting_confirmation">Waiting Confirmation</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Total</h3>
                  <p className="text-2xl font-bold text-[#1a1f3a]">
                    ₦{selectedOrder.total.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Orders;
