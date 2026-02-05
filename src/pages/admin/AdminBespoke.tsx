import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Search, Loader2, Eye, Palette } from "lucide-react";
import { toast } from "sonner";
import type { BespokeRequest } from "@/lib/database.types";

const bespokeStatuses = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "reviewed", label: "Reviewed", color: "bg-blue-100 text-blue-800" },
  { value: "quoted", label: "Quoted", color: "bg-purple-100 text-purple-800" },
  { value: "accepted", label: "Accepted", color: "bg-green-100 text-green-800" },
  { value: "in_progress", label: "In Progress", color: "bg-cyan-100 text-cyan-800" },
  { value: "completed", label: "Completed", color: "bg-gray-100 text-gray-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const AdminBespoke = () => {
  const [requests, setRequests] = useState<BespokeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<BespokeRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bespoke_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load bespoke requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setSaving(true);
    try {
      const updateData: { status: string; updated_at: string } = { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      };
      
      const { error } = await supabase
        .from("bespoke_requests")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
      toast.success("Status updated");
      fetchRequests();
      
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedRequest) return;
    
    setSaving(true);
    try {
      const updateData: { admin_notes: string; updated_at: string } = { 
        admin_notes: adminNotes, 
        updated_at: new Date().toISOString() 
      };
      
      const { error } = await supabase
        .from("bespoke_requests")
        .update(updateData)
        .eq("id", selectedRequest.id);

      if (error) throw error;
      toast.success("Notes saved");
      fetchRequests();
      setSelectedRequest({ ...selectedRequest, admin_notes: adminNotes });
    } catch (error: any) {
      toast.error(error.message || "Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusStyle = (status: string) => {
    const found = bespokeStatuses.find((s) => s.value === status);
    return found?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const found = bespokeStatuses.find((s) => s.value === status);
    return found?.label || status;
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openRequestDetail = (request: BespokeRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || "");
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-foreground mb-2">Bespoke Requests</h1>
          <p className="text-muted-foreground">
            Manage custom design requests
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
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
              <SelectItem value="all">All Requests</SelectItem>
              {bespokeStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bespoke requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-card rounded-lg p-6 border border-border hover:border-gold transition-colors cursor-pointer"
                onClick={() => openRequestDetail(request)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{request.customer_name}</h3>
                    <p className="text-sm text-muted-foreground">{request.customer_email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(request.status)}`}>
                    {getStatusLabel(request.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {request.description}
                </p>
                {request.reference_images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {request.reference_images.slice(0, 3).map((img, index) => (
                      <div key={index} className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                        <img src={img} alt="Reference" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {request.reference_images.length > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        +{request.reference_images.length - 3}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatDate(request.created_at)}</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Request Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedRequest && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">
                    Bespoke Request Details
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Customer Info */}
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-3">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedRequest.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedRequest.customer_email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedRequest.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{selectedRequest.budget || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-medium mb-3">Design Description</h3>
                    <p className="text-muted-foreground bg-muted p-4 rounded-lg">
                      {selectedRequest.description}
                    </p>
                  </div>

                  {/* Reference Images */}
                  {selectedRequest.reference_images.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Reference Images</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {selectedRequest.reference_images.map((img, index) => (
                          <a
                            key={index}
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square rounded-lg bg-muted overflow-hidden hover:opacity-80 transition-opacity"
                          >
                            <img src={img} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Update */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={selectedRequest.status}
                      onValueChange={(value) => updateStatus(selectedRequest.id, value)}
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bespokeStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Admin Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Admin Notes</label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add internal notes about this request..."
                      rows={3}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveAdminNotes}
                      disabled={saving}
                    >
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Save Notes
                    </Button>
                  </div>

                  {/* Meta */}
                  <div className="text-sm text-muted-foreground">
                    <p>Submitted: {formatDate(selectedRequest.created_at)}</p>
                    <p>Last Updated: {formatDate(selectedRequest.updated_at)}</p>
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

export default AdminBespoke;
