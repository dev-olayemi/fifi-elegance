import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Check if admin is logged in (from localStorage)
    const storedAdmin = localStorage.getItem('fifi_admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For now, simple authentication (you can enhance this with backend API)
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@fififashionwears.com';
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'FifiAdmin2024!';

    if (email === adminEmail && password === adminPassword) {
      const adminUser: AdminUser = {
        id: '1',
        email: adminEmail,
        name: 'Admin',
        role: 'admin',
      };
      setAdmin(adminUser);
      localStorage.setItem('fifi_admin', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('fifi_admin');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
