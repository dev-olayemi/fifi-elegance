import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors } from 'lucide-react';

const AdminBespoke = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-navy-900">Bespoke Requests</h1>
          <p className="text-muted-foreground">Manage custom order requests</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Scissors className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bespoke requests yet</h3>
              <p className="text-muted-foreground">
                Custom order requests will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBespoke;
