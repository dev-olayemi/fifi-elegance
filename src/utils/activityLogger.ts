/**
 * Activity Logger - Tracks user actions and generates CSV logs
 * Logs: Cart additions, Removals, Purchases, Wishlist actions, Page visits
 */

export interface ActivityLog {
  timestamp: string;
  action: string;
  itemName?: string;
  itemId?: string;
  category?: string;
  price?: number;
  quantity?: number;
  size?: string;
  cartTotal?: number;
  userAgent?: string;
  details?: string;
}

class ActivityLogger {
  private logs: ActivityLog[] = [];
  private readonly STORAGE_KEY = "fifi_activity_logs";
  private readonly MAX_LOGS = 10000;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Log an activity
   */
  logActivity(log: ActivityLog) {
    const enrichedLog: ActivityLog = {
      ...log,
      timestamp: log.timestamp || new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    this.logs.push(enrichedLog);

    // Keep only recent logs to avoid storage issues
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    this.saveToStorage();
  }

  /**
   * Log add to cart action
   */
  logAddToCart(
    itemId: string,
    itemName: string,
    price: number,
    size: string,
    quantity: number,
    cartTotal: number
  ) {
    this.logActivity({
      action: "ADD_TO_CART",
      itemId,
      itemName,
      price,
      size,
      quantity,
      cartTotal,
      details: `Added ${quantity}x ${itemName} (Size: ${size}) to cart`,
    });
  }

  /**
   * Log remove from cart action
   */
  logRemoveFromCart(
    itemId: string,
    itemName: string,
    price: number,
    size: string,
    quantity: number,
    cartTotal: number
  ) {
    this.logActivity({
      action: "REMOVE_FROM_CART",
      itemId,
      itemName,
      price,
      size,
      quantity,
      cartTotal,
      details: `Removed ${quantity}x ${itemName} (Size: ${size}) from cart`,
    });
  }

  /**
   * Log add to wishlist action
   */
  logAddToWishlist(itemId: string, itemName: string, price: number) {
    this.logActivity({
      action: "ADD_TO_WISHLIST",
      itemId,
      itemName,
      price,
      details: `Added ${itemName} to wishlist`,
    });
  }

  /**
   * Log remove from wishlist action
   */
  logRemoveFromWishlist(itemId: string, itemName: string, price: number) {
    this.logActivity({
      action: "REMOVE_FROM_WISHLIST",
      itemId,
      itemName,
      price,
      details: `Removed ${itemName} from wishlist`,
    });
  }

  /**
   * Log page visit
   */
  logPageVisit(page: string) {
    this.logActivity({
      action: "PAGE_VISIT",
      details: `Visited ${page}`,
    });
  }

  /**
   * Log order/checkout action
   */
  logCheckout(
    orderRef: string,
    totalAmount: number,
    itemCount: number,
    customerName: string
  ) {
    this.logActivity({
      action: "CHECKOUT",
      details: `Order placed - Ref: ${orderRef}, Total: ${totalAmount}, Items: ${itemCount}, Customer: ${customerName}`,
    });
  }

  /**
   * Get all logs
   */
  getAllLogs(): ActivityLog[] {
    return [...this.logs];
  }

  /**
   * Get logs by action type
   */
  getLogsByAction(action: string): ActivityLog[] {
    return this.logs.filter((log) => log.action === action);
  }

  /**
   * Get logs within date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date): ActivityLog[] {
    return this.logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  /**
   * Export logs as CSV string
   */
  exportAsCSV(): string {
    if (this.logs.length === 0) {
      return "No logs available";
    }

    // CSV Headers
    const headers = [
      "Timestamp",
      "Action",
      "Item Name",
      "Item ID",
      "Category",
      "Price",
      "Quantity",
      "Size",
      "Cart Total",
      "Details",
      "User Agent",
    ];

    // CSV Rows
    const rows = this.logs.map((log) => [
      log.timestamp,
      log.action,
      log.itemName || "",
      log.itemId || "",
      log.category || "",
      log.price || "",
      log.quantity || "",
      log.size || "",
      log.cartTotal || "",
      (log.details || "").replace(/,/g, ";"), // Escape commas in details
      log.userAgent || "",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains special chars
            const str = String(cell);
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(",")
      ),
    ].join("\n");

    return csvContent;
  }

  /**
   * Download logs as CSV file
   */
  downloadCSV(filename: string = "fifi-activity-logs.csv") {
    const csv = this.exportAsCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Get statistics summary
   */
  getStatistics() {
    const stats = {
      totalLogs: this.logs.length,
      totalAddToCart: this.getLogsByAction("ADD_TO_CART").length,
      totalRemoveFromCart: this.getLogsByAction("REMOVE_FROM_CART").length,
      totalAddToWishlist: this.getLogsByAction("ADD_TO_WISHLIST").length,
      totalCheckouts: this.getLogsByAction("CHECKOUT").length,
      totalPageVisits: this.getLogsByAction("PAGE_VISIT").length,
      totalRevenue: this.calculateRevenue(),
    };
    return stats;
  }

  /**
   * Calculate total revenue from checkout logs
   */
  private calculateRevenue(): number {
    let total = 0;
    const checkoutLogs = this.getLogsByAction("CHECKOUT");
    checkoutLogs.forEach((log) => {
      // Extract amount from details string if available
      const match = log.details?.match(/Total: ([\d,]+)/);
      if (match) {
        total += parseInt(match[1].replace(/,/g, ""));
      }
    });
    return total;
  }

  /**
   * Clear all logs
   */
  clearAllLogs() {
    this.logs = [];
    this.saveToStorage();
  }

  /**
   * Save logs to local storage
   */
  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error("Failed to save logs to storage:", error);
    }
  }

  /**
   * Load logs from local storage
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load logs from storage:", error);
      this.logs = [];
    }
  }
}

// Export singleton instance
export const activityLogger = new ActivityLogger();

export default ActivityLogger;
