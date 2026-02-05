import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, Palette, TrendingUp } from "lucide-react";

interface Stats {
  products: number;
  orders: number;
  pendingOrders: number;
  bespokeRequests: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    orders: 0,
    pendingOrders: 0,
    bespokeRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, bespokeRes] = await Promise.all([
          supabase.from("products").select("id", { count: "exact" }),
          supabase.from("orders").select("id, status"),
          supabase.from("bespoke_requests").select("id", { count: "exact" }),
        ]);

        const pendingOrders = ordersRes.data?.filter(
          (o: { id: string; status: string }) => o.status === "pending" || o.status === "processing"
        ).length || 0;

        setStats({
          products: productsRes.count || 0,
          orders: ordersRes.count || 0,
          pendingOrders,
          bespokeRequests: bespokeRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      color: "bg-navy",
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: ShoppingCart,
      color: "bg-gold",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "bg-destructive",
    },
    {
      title: "Bespoke Requests",
      value: stats.bespokeRequests,
      icon: Palette,
      color: "bg-accent",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Fifi Fashion Wears Admin Panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-card rounded-lg p-6 shadow-sm border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${card.color} ${
                    card.color === "bg-navy" ? "text-cream" : "text-navy"
                  }`}
                >
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-1">{card.title}</p>
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <p className="font-serif text-3xl text-foreground">{card.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="font-serif text-xl mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/products"
              className="p-4 bg-card rounded-lg border border-border hover:border-gold transition-colors"
            >
              <Package className="w-8 h-8 text-gold mb-2" />
              <h3 className="font-medium">Manage Products</h3>
              <p className="text-sm text-muted-foreground">
                Add, edit or remove products
              </p>
            </a>
            <a
              href="/admin/orders"
              className="p-4 bg-card rounded-lg border border-border hover:border-gold transition-colors"
            >
              <ShoppingCart className="w-8 h-8 text-gold mb-2" />
              <h3 className="font-medium">View Orders</h3>
              <p className="text-sm text-muted-foreground">
                Process and fulfill orders
              </p>
            </a>
            <a
              href="/admin/bespoke"
              className="p-4 bg-card rounded-lg border border-border hover:border-gold transition-colors"
            >
              <Palette className="w-8 h-8 text-gold mb-2" />
              <h3 className="font-medium">Bespoke Requests</h3>
              <p className="text-sm text-muted-foreground">
                View custom order requests
              </p>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
