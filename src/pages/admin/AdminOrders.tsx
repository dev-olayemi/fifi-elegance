import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Loader2, Eye, Package } from "lucide-react";
import { toast } from "sonner";
import type { Order, Json } from "@/lib/database.types";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

const orderStatuses = [
  { value: "pending", label: "Pending Payment", color: "bg-yellow-100 text-yellow-800" },
  { value: "waiting_confirmation", label: "Waiting Confirmation", color: "bg-blue-100 text-blue-800" },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "processing", label: "Processing", color: "bg-purple-100 text-purple-800" },
  { value: "ready", label: "Ready", color: "bg-cyan-100 text-cyan-800" },
  { value: "delivered", label: "Delivered", color: "bg-gray-100 text-gray-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const paymentStatuses = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "failed", label: "Failed" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const updateData: { status: string; updated_at: string } = { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      };
      
      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Order status updated");
      fetchOrders();
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    setUpdating(true);
    try {
      const updates: { payment_status: string; updated_at: string; status?: string } = { 
        payment_status: newPaymentStatus, 
        updated_at: new Date().toISOString() 
      };
      
      // Auto-update order status if payment is confirmed
      if (newPaymentStatus === "confirmed") {
        updates.status = "paid";
      }

      const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Payment status updated");
      fetchOrders();
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: newPaymentStatus, ...updates });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update payment status");
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusStyle = (status: string) => {
    const found = orderStatuses.find((s) => s.value === status);
    return found?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const found = orderStatuses.find((s) => s.value === status);
    return found?.label || status;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const parseOrderItems = (items: Json): OrderItem[] => {
    if (Array.isArray(items)) {
      return items as unknown as OrderItem[];
    }
    return [];
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground">
            View and manage customer orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {orderStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium">Order</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Customer</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50">
                      <td className="p-4">
                        <p className="font-mono text-sm">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground md:hidden">
                          {order.customer_name}
                        </p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </td>
                      <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">
                    Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Customer Info */}
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-3">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedOrder.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedOrder.customer_email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedOrder.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Address</p>
                        <p className="font-medium">{selectedOrder.customer_address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {parseOrderItems(selectedOrder.items).map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="w-16 h-16 rounded-lg bg-card overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                      <span className="font-medium">Total</span>
                      <span className="font-serif text-xl">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>

                  {/* Status Updates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Order Status</label>
                      <Select
                        value={selectedOrder.status}
                        onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                        disabled={updating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Status</label>
                      <Select
                        value={selectedOrder.payment_status}
                        onValueChange={(value) => updatePaymentStatus(selectedOrder.id, value)}
                        disabled={updating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="text-sm text-muted-foreground">
                    <p>Created: {formatDate(selectedOrder.created_at)}</p>
                    <p>Last Updated: {formatDate(selectedOrder.updated_at)}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
