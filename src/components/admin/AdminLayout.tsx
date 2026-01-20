import { ReactNode, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Scissors,
  Settings,
  LogOut,
  FolderTree,
  FileText,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuth = localStorage.getItem('fifi_admin_auth');
    if (!isAuth) {
      navigate('/fifi-admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('fifi_admin_auth');
    navigate('/fifi-admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/fifi-admin/dashboard' },
    { icon: Package, label: 'Products', path: '/fifi-admin/products' },
    { icon: FolderTree, label: 'Categories', path: '/fifi-admin/categories' },
    { icon: ShoppingCart, label: 'Orders', path: '/fifi-admin/orders' },
    { icon: Scissors, label: 'Bespoke Requests', path: '/fifi-admin/bespoke' },
    { icon: Users, label: 'Customers', path: '/fifi-admin/customers' },
    { icon: FileText, label: 'SEO Settings', path: '/fifi-admin/seo' },
    { icon: Settings, label: 'Site Settings', path: '/fifi-admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1f3a] text-white z-50">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center">
              <span className="text-lg font-serif font-bold text-[#1a1f3a]">FF</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-white">Fifi Fashion</h1>
              <p className="text-xs text-gray-400">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90 font-semibold' 
                      : 'text-white hover:bg-[#2a2f4a]'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-[#2a2f4a]"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
