import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Button } from "@/components/ui/button";
import { activityLogger } from "@/utils/activityLogger";
import { Download, RefreshCw, Trash2, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const ActivityLogs = () => {
  const [logs, setLogs] = useState(activityLogger.getAllLogs());
  const [stats, setStats] = useState(activityLogger.getStatistics());

  const handleRefresh = () => {
    setLogs(activityLogger.getAllLogs());
    setStats(activityLogger.getStatistics());
    toast.success("Logs refreshed!");
  };

  const handleDownloadCSV = () => {
    activityLogger.downloadCSV(`fifi-activity-logs-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("CSV downloaded successfully!");
  };

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all logs? This action cannot be undone.")) {
      activityLogger.clearAllLogs();
      setLogs([]);
      setStats(activityLogger.getStatistics());
      toast.success("All logs cleared!");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <CartSidebar />
      <main className="pt-24 md:pt-28">
        {/* Hero */}
        <section className="bg-navy text-cream py-16 md:py-24">
          <div className="luxury-container text-center">
            <p className="luxury-subheading text-gold mb-3">Analytics</p>
            <h1 className="font-serif text-4xl md:text-6xl mb-4">Activity Logs</h1>
            <p className="text-cream/80 max-w-2xl mx-auto">
              Track all user activities, cart actions, purchases, and wishlist interactions
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-20">
          <div className="luxury-container">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-muted p-4 md:p-6 rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-2">Total Logs</p>
                <p className="font-serif text-2xl md:text-3xl">{stats.totalLogs}</p>
              </div>
              <div className="bg-muted p-4 md:p-6 rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-2">Add to Cart</p>
                <p className="font-serif text-2xl md:text-3xl text-gold">{stats.totalAddToCart}</p>
              </div>
              <div className="bg-muted p-4 md:p-6 rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-2">Total Checkouts</p>
                <p className="font-serif text-2xl md:text-3xl text-green-500">{stats.totalCheckouts}</p>
              </div>
              <div className="bg-muted p-4 md:p-6 rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-2">Wishlist Actions</p>
                <p className="font-serif text-2xl md:text-3xl">{stats.totalAddToWishlist}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                variant="luxury"
                size="lg"
                onClick={handleDownloadCSV}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
              <Button
                variant="luxuryOutline"
                size="lg"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                variant="luxuryOutline"
                size="lg"
                onClick={handleClearLogs}
                className="flex items-center gap-2 text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Clear Logs
              </Button>
            </div>

            {/* Logs Table */}
            <div className="bg-muted rounded-lg overflow-x-auto">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No activity logs yet</p>
                </div>
              ) : (
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-background border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Timestamp</th>
                      <th className="px-4 py-3 text-left font-medium">Action</th>
                      <th className="px-4 py-3 text-left font-medium">Item</th>
                      <th className="px-4 py-3 text-left font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs
                      .slice()
                      .reverse()
                      .map((log, index) => (
                        <tr
                          key={index}
                          className="border-b border-border hover:bg-background/50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                log.action === "ADD_TO_CART"
                                  ? "bg-blue-100 text-blue-700"
                                  : log.action === "CHECKOUT"
                                  ? "bg-green-100 text-green-700"
                                  : log.action === "ADD_TO_WISHLIST"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="px-4 py-3">{log.itemName || "-"}</td>
                          <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                            {log.details || "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-gold/10 border border-gold/30 rounded-lg p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground">
                <strong>Note:</strong> Activity logs are stored locally in your browser. They track all
                user actions including cart additions, removals, wishlist interactions, page visits, and
                checkout confirmations. Download as CSV for record-keeping and analysis.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ActivityLogs;
