import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const SEOSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1a1f3a]">SEO Settings</h1>
            <p className="text-gray-600 mt-1">Optimize your site for search engines</p>
          </div>
          <Button className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90 font-semibold">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <div className="bg-white rounded-lg border p-8">
          <p className="text-gray-500">SEO settings form will appear here</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SEOSettings;
