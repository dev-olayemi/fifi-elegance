import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, Phone, User, Calendar, LogOut } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setProfile(user);
    setFormData({ fullName: user.fullName, phone: user.phone });
  }, [navigate]);

  const handleSaveProfile = async () => {
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      toast({ title: 'Error', description: 'All fields are required' });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:3001/api/customers/${profile?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = { ...profile, ...formData };
        setProfile(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        toast({ title: 'Success', description: 'Profile updated successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    toast({ title: 'Success', description: 'Logged out successfully' });
  };

  if (!profile) return null;

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartSidebar />
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 mb-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Full Name</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Email Address</Label>
                <Input
                  value={profile.email}
                  disabled
                  placeholder="Email cannot be changed"
                  className="mt-1 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ fullName: profile.fullName, phone: profile.phone });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Profile Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="bg-brand/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-brand" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-lg font-semibold">{profile.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="text-lg font-semibold">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="text-lg font-semibold">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-semibold">{memberSince}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200 bg-red-50">
          <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
