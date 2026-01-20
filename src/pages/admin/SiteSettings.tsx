import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { settingsApi } from '@/lib/api/settings';
import { bankApi, type BankFormData } from '@/lib/api/banks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isActive: boolean;
}

const SiteSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);

  // Site Settings State
  const [settings, setSettings] = useState({
    site_name: 'Fifi Fashion Wears',
    site_tagline: 'LE LUXE - Premium Ready-to-Wear Collection',
    contact_email: 'fififashionwears@gmail.com',
    contact_phone: '08122815425',
    contact_whatsapp: '08122815425',
    instagram_url: 'https://www.instagram.com/fifi_fashion_wears1',
    shipping_fee: '2000',
    free_shipping_threshold: '50000',
  });

  // Bank Form State
  const [bankForm, setBankForm] = useState<BankFormData>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    isActive: true,
  });

  useEffect(() => {
    loadSettings();
    loadBanks();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await settingsApi.getAll();
      const settingsObj: any = {};
      allSettings.forEach((setting) => {
        settingsObj[setting.key] = setting.value;
      });
      setSettings((prev) => ({ ...prev, ...settingsObj }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadBanks = async () => {
    try {
      const bankAccounts = await bankApi.getAll();
      setBanks(bankAccounts);
    } catch (error) {
      console.error('Error loading banks:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        const type = ['shipping_fee', 'free_shipping_threshold'].includes(key) ? 'number' : 'text';
        await settingsApi.upsert(key, value, type);
      }
      toast({
        title: 'Settings Saved',
        description: 'Your site settings have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingBank) {
        await bankApi.update(editingBank.id, bankForm);
        toast({
          title: 'Bank Updated',
          description: 'Bank account has been updated successfully.',
        });
      } else {
        await bankApi.create(bankForm);
        toast({
          title: 'Bank Added',
          description: 'New bank account has been added successfully.',
        });
      }
      setIsBankDialogOpen(false);
      resetBankForm();
      loadBanks();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save bank account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBank = (bank: BankAccount) => {
    setEditingBank(bank);
    setBankForm({
      bankName: bank.bankName,
      accountName: bank.accountName,
      accountNumber: bank.accountNumber,
      isActive: bank.isActive,
    });
    setIsBankDialogOpen(true);
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bank account?')) return;
    
    try {
      await bankApi.delete(id);
      toast({
        title: 'Bank Deleted',
        description: 'Bank account has been deleted successfully.',
      });
      loadBanks();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete bank account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetBankForm = () => {
    setEditingBank(null);
    setBankForm({
      bankName: '',
      accountName: '',
      accountNumber: '',
      isActive: true,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1a1f3a]">Site Settings</h1>
            <p className="text-gray-600 mt-1">Configure your website settings</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="banks">Bank Accounts</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic site information and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_tagline">Site Tagline</Label>
                  <Input
                    id="site_tagline"
                    value={settings.site_tagline}
                    onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                  />
                </div>
                <Button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90 font-semibold"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Settings */}
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Email, phone, and social media links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone</Label>
                    <Input
                      id="contact_phone"
                      value={settings.contact_phone}
                      onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_whatsapp">WhatsApp</Label>
                    <Input
                      id="contact_whatsapp"
                      value={settings.contact_whatsapp}
                      onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram_url">Instagram URL</Label>
                    <Input
                      id="instagram_url"
                      value={settings.instagram_url}
                      onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90 font-semibold"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Configuration</CardTitle>
                <CardDescription>Set shipping fees and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipping_fee">Shipping Fee (₦)</Label>
                    <Input
                      id="shipping_fee"
                      type="number"
                      value={settings.shipping_fee}
                      onChange={(e) => setSettings({ ...settings, shipping_fee: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (₦)</Label>
                    <Input
                      id="free_shipping_threshold"
                      type="number"
                      value={settings.free_shipping_threshold}
                      onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">Orders above this amount get free shipping</p>
                  </div>
                </div>
                <Button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90 font-semibold"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bank Accounts */}
          <TabsContent value="banks" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Bank Accounts</CardTitle>
                    <CardDescription>Manage payment bank accounts</CardDescription>
                  </div>
                  <Dialog open={isBankDialogOpen} onOpenChange={(open) => {
                    setIsBankDialogOpen(open);
                    if (!open) resetBankForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90 font-semibold">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Bank Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-serif text-[#1a1f3a]">
                          {editingBank ? 'Edit Bank Account' : 'Add Bank Account'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingBank ? 'Update bank account details' : 'Add a new bank account for payments'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSaveBank} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name *</Label>
                          <Input
                            id="bankName"
                            value={bankForm.bankName}
                            onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                            placeholder="First Bank of Nigeria"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountName">Account Name *</Label>
                          <Input
                            id="accountName"
                            value={bankForm.accountName}
                            onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                            placeholder="Fifi Fashion Wears"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number *</Label>
                          <Input
                            id="accountNumber"
                            value={bankForm.accountNumber}
                            onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                            placeholder="1234567890"
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isActive"
                            checked={bankForm.isActive}
                            onCheckedChange={(checked) => setBankForm({ ...bankForm, isActive: checked })}
                          />
                          <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsBankDialogOpen(false);
                              resetBankForm();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#d4af37] text-[#1a1f3a] hover:bg-[#d4af37]/90"
                          >
                            {loading ? 'Saving...' : editingBank ? 'Update' : 'Add Bank'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {banks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No bank accounts yet. Click "Add Bank Account" to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {banks.map((bank) => (
                      <div
                        key={bank.id}
                        className="border rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#1a1f3a] rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-[#d4af37]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#1a1f3a]">{bank.bankName}</h4>
                            <p className="text-sm text-gray-600">{bank.accountName}</p>
                            <p className="text-sm font-mono text-gray-700">{bank.accountNumber}</p>
                            <span
                              className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                                bank.isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {bank.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBank(bank)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteBank(bank.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SiteSettings;
