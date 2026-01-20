import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { customersApi } from '@/lib/api/customers';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, ShoppingBag, Scissors } from 'lucide-react';

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  createdAt: string;
  _count: {
    orders: number;
    bespoke: number;
  };
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1f3a]">Customers</h1>
          <p className="text-gray-600 mt-1">View and manage customer information</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <p className="text-gray-500">No customers yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <Card key={customer.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1a1f3a] rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-[#d4af37]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1a1f3a] truncate">
                        {customer.fullName}
                      </h3>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          {customer._count.orders} Orders
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Scissors className="h-3 w-3 mr-1" />
                          {customer._count.bespoke} Bespoke
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Joined {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers;
