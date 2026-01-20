import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple authentication (in production, this should be server-side)
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@fififashionwears.com';
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'FifiAdmin2024!';

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('fifi_admin_auth', 'true');
      toast({
        title: 'Login Successful',
        description: 'Welcome to Fifi Fashion Wears Admin',
      });
      navigate('/fifi-admin/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1f3a] via-[#252b4a] to-[#1a1f3a] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center">
              <span className="text-2xl font-serif font-bold text-[#1a1f3a]">FF</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-serif">Fifi Fashion Wears</CardTitle>
          <CardDescription>Admin Portal - LE LUXE Collection</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@fififashionwears.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90 font-semibold" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
