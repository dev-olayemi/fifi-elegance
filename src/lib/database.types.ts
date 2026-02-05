export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = 'admin' | 'moderator' | 'user';

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          description: string | null;
          fabric: string | null;
          sizes: string[];
          images: string[];
          category_id: string | null;
          featured: boolean;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          description?: string | null;
          fabric?: string | null;
          sizes?: string[];
          images?: string[];
          category_id?: string | null;
          featured?: boolean;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          description?: string | null;
          fabric?: string | null;
          sizes?: string[];
          images?: string[];
          category_id?: string | null;
          featured?: boolean;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_address: string;
          items: Json;
          total: number;
          status: string;
          payment_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_address: string;
          items: Json;
          total: number;
          status?: string;
          payment_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          customer_address?: string;
          items?: Json;
          total?: number;
          status?: string;
          payment_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bespoke_requests: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          description: string;
          reference_images: string[];
          budget: string | null;
          status: string;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          description: string;
          reference_images?: string[];
          budget?: string | null;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          description?: string;
          reference_images?: string[];
          budget?: string | null;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: AppRole;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: AppRole;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: AppRole;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
    };
    CompositeTypes: {};
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type BespokeRequest = Database['public']['Tables']['bespoke_requests']['Row'];

// Helper types for inserts and updates
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];
export type BespokeRequestUpdate = Database['public']['Tables']['bespoke_requests']['Update'];
