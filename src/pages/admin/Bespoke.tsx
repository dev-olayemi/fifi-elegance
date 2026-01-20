import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { bespokeApi } from '@/lib/api/bespoke';
import { useToast } from '@/hooks/use-toast';
import { Eye } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BespokeRequest {
  id: string;
  requestNumber: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    whatsapp?: string;
  };
  description: string;
  measurements: string;
  budgetRange?: string;
  deadline?: string;
  status: string;
  quotedPrice?: number;
  adminNotes?: string;
  createdAt: string;
}

const BespokeRequests = () => {
  const [requests, setRequests] = useState<BespokeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<BespokeRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [quotedPrice, setQuotedPrice] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await bespokeApi.getAll();
      setRequests(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load bespoke requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      await bespokeApi.update(requestId, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: 'Request status has been updated successfully',
      });
      loadRequests();
      if (selectedRequest?.id === requestId) {
        const updated = await bespokeApi.getById(requestId);
        setSelectedRequest(updated);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update request status',
        variant: 'destructive',
      });
    }
  };

  const handleSaveQuote = async () => {
    if (!selectedRequest) return;
    
    try {
      await bespokeApi.update(selectedRequest.id, {
        quotedPrice: parseFloat(quotedPrice),
        adminNotes,
        status: 'quoted',
      });
      toast({
        title: 'Quote Saved',
        description: 'Quote has been saved successfully',
      });
      loadRequests();
      setIsDetailOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save quote',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: 'secondary',
      reviewing: 'outline',
      quoted: 'default',
      approved: 'default',
      in_progress: 'default',
      completed: 'default',
      rejected: 'destructive',
    };

    const labels: any = {
      pending: 'Pending',
      reviewing: 'Reviewing',
      quoted: 'Quoted',
      approved: 'Approved',
      in_progress: 'In Progress',
      completed: 'Completed',
      rejected: 'Rejected',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const filterRequests = (status?: string) => {
    if (!status) return requests;
    return requests.filter((req) => req.status === status);
  };

  const RequestCard = ({ request }: { request: BespokeRequest }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">#{request.requestNumber}</h3>
              {getStatusBadge(request.status)}
            </div>
            <p className="text-sm text-gray-600">
              <strong>Customer:</strong> {request.customer.fullName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {request.customer.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Phone:</strong> {request.customer.phone}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              <strong>Description:</strong> {request.description}
            </p>
            {request.budgetRange && (
              <p className="text-sm text-gray-600">
                <strong>Budget:</strong> {request.budgetRange}
              </p>
            )}
            {request.quotedPrice && (
              <p className="text-sm font-semibold text-[#1a1f3a]">
                Quoted: ₦{request.quotedPrice.toLocaleString()}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {new Date(request.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedRequest(request);
                setQuotedPrice(request.quotedPrice?.toString() || '');
                setAdminNotes(request.adminNotes || '');
                setIsDetailOpen(true);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1f3a]">Bespoke Requests</h1>
          <p className="text-gray-600 mt-1">Manage custom dress orders</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({filterRequests('pending').length})</TabsTrigger>
            <TabsTrigger value="reviewing">Reviewing ({filterRequests('reviewing').length})</TabsTrigger>
            <TabsTrigger value="quoted">Quoted ({filterRequests('quoted').length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({filterRequests('approved').length})</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress ({filterRequests('in_progress').length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({filterRequests('completed').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="text-center py-8">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No bespoke requests yet</p>
              </div>
            ) : (
              <div>
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {filterRequests('pending').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No pending requests</p>
              </div>
            ) : (
              <div>
                {filterRequests('pending').map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewing" className="mt-6">
            {filterRequests('reviewing').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No requests under review</p>
              </div>
            ) : (
              <div>
                {filterRequests('reviewing').map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quoted" className="mt-6">
            {filterRequests('quoted').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No quoted requests</p>
              </div>
            ) : (
              <div>
                {filterRequests('quoted').map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {filterRequests('approved').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No approved requests</p>
              </div>
            ) : (
              <div>
                {filterRequests('approved').map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="in_progress" className="mt-6">
            {filterRequests('in_progress').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No requests in progress</p>
              </div>
            ) : (
              <div>
                {filterRequests('in_progress').map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {filterRequests('completed').length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <p className="text-gray-500">No completed requests</p>
              </div>
            ) : (
              <div>
                {filterRequests('completed').map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Request Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-[#1a1f3a]">
                Bespoke Request Details
              </DialogTitle>
              <DialogDescription>
                {selectedRequest && `Request #${selectedRequest.requestNumber}`}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                    <p><strong>Name:</strong> {selectedRequest.customer.fullName}</p>
                    <p><strong>Email:</strong> {selectedRequest.customer.email}</p>
                    <p><strong>Phone:</strong> {selectedRequest.customer.phone}</p>
                    {selectedRequest.customer.whatsapp && (
                      <p><strong>WhatsApp:</strong> {selectedRequest.customer.whatsapp}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Request Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Description:</p>
                      <p className="mt-1">{selectedRequest.description}</p>
                    </div>
                    {selectedRequest.measurements && (
                      <div>
                        <p className="text-sm text-gray-600">Measurements:</p>
                        <p className="mt-1">{selectedRequest.measurements}</p>
                      </div>
                    )}
                    {selectedRequest.budgetRange && (
                      <p><strong>Budget Range:</strong> {selectedRequest.budgetRange}</p>
                    )}
                    {selectedRequest.deadline && (
                      <p><strong>Deadline:</strong> {new Date(selectedRequest.deadline).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <Select
                    value={selectedRequest.status}
                    onValueChange={(value) => handleStatusUpdate(selectedRequest.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Quote Price (₦)</h3>
                  <Input
                    type="number"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    placeholder="Enter quoted price"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Admin Notes</h3>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this request..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSaveQuote}
                  className="w-full bg-[#1a1f3a] hover:bg-[#1a1f3a]/90"
                >
                  Save Quote & Notes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BespokeRequests;
