# FIFI FASHION WEARS - COMPLETE ADMIN PANEL & E-COMMERCE MANAGEMENT SYSTEM PROMPT

## PROJECT OVERVIEW

**Project Name:** Fifi Fashion Wears - LE LUXE Collection  
**Type:** Luxury Fashion E-Commerce Platform  
**URL:** https://fififashion.shop  
**Admin Panel:** https://fififashion.shop/admin-panel  
**Tech Stack:** React + TypeScript, Vite, TailwindCSS, Supabase (PostgreSQL), Cloudinary

---

## CURRENT PROJECT STATE

### Frontend Features Already Built:
- ✅ Hero section with video background (vid1.mp4)
- ✅ Gallery section with images and videos (fifi.mp4)
- ✅ Product listing and detail pages
- ✅ Shopping cart functionality (real-time cart with count)
- ✅ Wishlist system with full tracking
- ✅ Bespoke/custom order request form
- ✅ Checkout process with 3-step workflow (details → payment → confirmation)
- ✅ Activity logging system (CSV export, statistics)
- ✅ WhatsApp support widget (08122815425)
- ✅ Scroll-to-top button
- ✅ Fully mobile-responsive design
- ✅ Contact form, About page, FAQ
- ✅ Order tracking page

### Existing Integrations:
- Supabase PostgreSQL database ready
- Cloudinary for media management
- Activity logging with local storage persistence
- Phone contact: 08122815425
- Email: fififashionwears@gmail.com

---

## DATABASE SCHEMA REQUIRED

### Tables to Create in Supabase:

#### 1. **Products Table**
```
- id (UUID, primary key)
- name (text, required)
- category (text) - "Ready-to-Wear", "Bespoke", "Accessories"
- description (text)
- fabric (text)
- price (numeric, required)
- discounted_price (numeric, optional)
- images (text array) - Cloudinary URLs
- sizes (text array) - S, M, L, XL, XXL, Custom
- stock_quantity (integer)
- sku (text, unique)
- status (enum) - "active", "inactive", "discontinued"
- featured (boolean)
- created_at (timestamp)
- updated_at (timestamp)
- created_by_admin (UUID, foreign key to admins)
```

#### 2. **Orders Table**
```
- id (UUID, primary key)
- order_reference (text, unique) - Format: FFW-TIMESTAMP-RANDOM
- customer_name (text, required)
- customer_email (email, required)
- customer_phone (text, required)
- customer_whatsapp (text)
- delivery_address (text, required)
- city (text, required)
- state (text, required)
- total_amount (numeric, required)
- payment_status (enum) - "pending", "confirmed", "failed"
- payment_method (text) - "bank_transfer", "card", etc.
- order_status (enum) - "pending", "processing", "shipped", "delivered", "cancelled"
- items (JSONB) - Array of ordered items with details
- notes (text)
- tracking_url (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
- completed_at (timestamp, optional)
```

#### 3. **Bespoke Requests Table**
```
- id (UUID, primary key)
- request_reference (text, unique)
- customer_name (text, required)
- customer_email (email, required)
- customer_phone (text, required)
- customer_whatsapp (text)
- outfit_description (text, required)
- measurements (text) - Bust, waist, hips, etc.
- budget_range (text) - "50000-100000", "100000-200000", etc.
- deadline (date)
- status (enum) - "new", "in_progress", "quoted", "in_production", "completed", "cancelled"
- estimated_price (numeric)
- final_price (numeric, optional)
- progress_notes (text)
- attachments (text array) - Reference images, sketches
- created_at (timestamp)
- updated_at (timestamp)
- completed_at (timestamp, optional)
```

#### 4. **Admins Table**
```
- id (UUID, primary key)
- email (email, unique, required)
- password_hash (text, required)
- full_name (text, required)
- role (enum) - "super_admin", "product_manager", "order_manager", "viewer"
- permissions (text array) - specific features they can access
- is_active (boolean)
- last_login (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 5. **Activity Logs Table**
```
- id (UUID, primary key)
- admin_id (UUID, foreign key)
- action (text) - "create_product", "update_order", "add_admin", etc.
- entity_type (text) - "product", "order", "bespoke_request", "admin"
- entity_id (UUID)
- changes (JSONB) - before/after values
- ip_address (text)
- user_agent (text)
- created_at (timestamp)
```

#### 6. **Wishlist Table** (Optional - for backend storage)
```
- id (UUID, primary key)
- user_identifier (text) - email or device ID
- product_id (UUID, foreign key)
- created_at (timestamp)
```

---

## ADMIN PANEL REQUIREMENTS

### Admin Routes & Features:

#### **1. Admin Login (/admin-panel or /admin-login)**
- Email and password authentication
- Remember me option
- Session management with JWT tokens
- 2FA option (optional enhancement)
- Password reset via email functionality
- Rate limiting (prevent brute force)

#### **2. Admin Dashboard (/admin-panel/dashboard)**
**Key Metrics Display:**
- Total products count
- Total orders (last 30 days)
- Total revenue (last 30 days)
- Pending orders count
- Bespoke requests pending
- Customer count
- Average order value

**Charts & Analytics:**
- Revenue trend (daily/weekly/monthly)
- Orders by status (pie chart)
- Product sales ranking (top 10 products)
- Traffic source analytics
- Conversion rate

**Quick Actions:**
- Create new product (button)
- View pending orders (quick link)
- View pending bespoke requests (quick link)
- Send bulk WhatsApp notifications
- Download activity reports

---

#### **3. Product Management (/admin-panel/products)**

**Product List View:**
- Table with columns: Image, Name, Category, SKU, Price, Stock, Status, Featured, Actions
- Search by name/SKU
- Filter by category, status, featured
- Sort by date, price, stock
- Bulk actions (delete, change status, set featured)
- Pagination
- Export to CSV

**Create Product:**
- Form fields:
  - Product name (required)
  - Category dropdown (Ready-to-Wear, Bespoke, Accessories)
  - Description (rich text editor)
  - Fabric type
  - Price (required)
  - Discounted price (optional)
  - Multiple image upload (via Cloudinary)
  - Size checkboxes (S, M, L, XL, XXL, Custom)
  - Stock quantity
  - SKU (auto-generate option)
  - Featured toggle
  - Status (active/inactive)
- Image drag-drop with preview
- Real-time SKU availability check
- Save as draft or publish immediately

**Edit Product:**
- All create fields with pre-filled data
- Change tracking (show what changed)
- Option to view product on website
- Archive/restore functionality
- Revision history

**Bulk Operations:**
- Import products via CSV
- Update multiple products at once
- Change category for multiple items
- Update pricing across products

---

#### **4. Order Management (/admin-panel/orders)**

**Orders List View:**
- Table columns: Order Ref, Customer, Date, Total, Status, Payment Status, Actions
- Advanced filters:
  - By order status (pending, processing, shipped, delivered, cancelled)
  - By payment status (pending, confirmed, failed)
  - By date range
  - By customer name/email
  - By amount range
- Search by order reference
- Sort by date, amount, status
- Pagination with 25/50/100 rows option
- Export filtered orders to CSV

**Order Detail View:**
- Customer information (name, email, phone, WhatsApp, address)
- Order items (product name, size, quantity, price)
- Order total breakdown (subtotal, shipping, tax if applicable)
- Order timeline (created, payment received, shipped, etc.)
- Payment details (method, reference, amount, status)
- Order notes/comments section

**Order Status Management:**
- Update status (dropdown with workflow validation)
  - Pending → Processing
  - Processing → Shipped
  - Shipped → Delivered
  - Any → Cancelled (with reason)
- Add internal notes
- Assign to team member
- Track fulfillment dates

**Shipping Management:**
- Add tracking number
- Select shipping method
- Generate shipping label (integration ready)
- Send tracking update to customer (via WhatsApp + email)
- Mark as delivered

**Payment Verification:**
- View payment proof/reference
- Mark payment as confirmed
- Handle failed payments (retry options)
- Refund processing (with reason)
- Generate payment receipt

**Customer Communication:**
- Send order update via WhatsApp (pre-written templates)
- Send invoice via email
- Add internal notes
- View customer communication history
- Record follow-up calls

**Order Actions:**
- View PDF invoice
- Send invoice
- Send tracking
- Cancel order
- Archive order
- Print order details
- Create similar order for repeat customer

---

#### **5. Bespoke Requests Management (/admin-panel/bespoke)**

**Bespoke Requests List:**
- Table columns: Request Ref, Customer, Date, Status, Budget, Deadline, Actions
- Filters:
  - By status (new, in_progress, quoted, in_production, completed, cancelled)
  - By budget range
  - By deadline (overdue, upcoming)
  - By date range
- Search by request reference or customer name
- Sort by date, status, deadline
- Pagination

**Bespoke Request Detail:**
- Customer information (full details)
- Outfit description and vision
- Measurements (with visual diagram if needed)
- Budget and deadline
- Reference images (from Cloudinary)
- Status timeline

**Bespoke Workflow:**
- Stage 1: New Request
  - Review customer requirements
  - Assess feasibility
  - Assign to designer/tailor
  - Add internal notes
  - Set initial timeline

- Stage 2: In Progress
  - Design sketches upload
  - Progress notes
  - Estimated timeline update
  - Customer communication
  - Share updates via WhatsApp

- Stage 3: Quotation
  - Generate quote (with all costs)
  - Send quote to customer
  - Track quote acceptance
  - Estimated price vs final price

- Stage 4: In Production
  - Material procurement tracking
  - Production phase notes
  - Progress percentage
  - Expected delivery date
  - Quality check tracking

- Stage 5: Completed
  - Final photos
  - Delivery date
  - Customer feedback
  - Archive project
  - Generate order from bespoke

**Actions:**
- Send quote via WhatsApp
- Upload design sketches
- Record progress notes
- Update timeline
- Convert to order
- Send completion notification
- Request customer feedback
- Archive request

---

#### **6. Customer Management (/admin-panel/customers)**

**Customers List:**
- Table: Name, Email, Phone, Orders, Total Spent, Last Order, Actions
- Search by name/email/phone
- Filter by registration date
- Sort by total spent, orders, last order
- Pagination

**Customer Profile:**
- Contact information
- Address history
- Order history (linked)
- Wishlist
- Preferences (newsletters, promotions)
- Bespoke request history
- Activity timeline
- Communication history

**Customer Actions:**
- Send message via WhatsApp
- Send promotional email
- Add internal notes
- Edit customer info
- View full order history
- View wishlist
- Segment for marketing

---

#### **7. Analytics & Reports (/admin-panel/reports)**

**Available Reports:**
1. **Sales Report**
   - Revenue by period (daily/weekly/monthly)
   - Orders by status
   - Top selling products
   - Top customers
   - Average order value trend

2. **Product Report**
   - Sales by category
   - Stock levels (low stock alerts)
   - Product performance (sales vs inventory)
   - New products performance
   - Discontinued products review

3. **Customer Report**
   - New customers
   - Repeat purchase rate
   - Customer lifetime value
   - Churn analysis
   - Geographic distribution

4. **Bespoke Report**
   - Bespoke requests by status
   - Average project timeline
   - Bespoke revenue vs ready-to-wear
   - Popular styles/requests

5. **Payment Report**
   - Payment status breakdown
   - Failed payments
   - Payment methods used
   - Refunds issued

**Export Options:**
- PDF reports
- CSV data
- Excel with charts
- Schedule email reports

---

#### **8. Admin Management (/admin-panel/admins)**
*Only for Super Admin*

- List all admins (table: Name, Email, Role, Last Login, Actions)
- Create new admin (email, password, role assignment)
- Edit admin (role, permissions, status)
- Deactivate/reactivate admin
- View admin activity log
- Change admin password
- Delete admin (with audit trail)

**Roles:**
- **Super Admin:** Full access, admin management
- **Product Manager:** Create/edit/delete products
- **Order Manager:** Process orders, manage fulfillment
- **Bespoke Manager:** Handle bespoke requests
- **Viewer:** Read-only access

---

#### **9. Settings (/admin-panel/settings)**

**General Settings:**
- Business name
- Logo upload
- Contact phone/email
- Business hours
- Address
- Social media links

**Email Templates:**
- Order confirmation
- Shipment notification
- Delivery notification
- Bespoke quote
- Bespoke completion

**WhatsApp Templates:**
- Order confirmation
- Payment received
- Order shipped
- Delivery notification
- Follow-up message

**Store Settings:**
- Shipping methods and costs
- Tax rates
- Currency
- Payment methods
- Newsletter preferences

**Notification Preferences:**
- Email alerts for new orders
- SMS/WhatsApp alerts
- Low stock alerts
- Daily/weekly digests

---

#### **10. Activity Logs (/admin-panel/logs)**

**Audit Trail:**
- Table: Admin, Action, Entity, Timestamp, Details
- Filter by admin, action type, date range
- Search by order/product/customer reference
- View before/after changes
- Download audit trail as CSV
- 90-day retention (configurable)

---

## AUTHENTICATION & SECURITY

### Login Flow:
1. Visit `/admin-panel`
2. Redirect to `/admin-login` if not authenticated
3. Enter email and password
4. Server validates credentials against admins table
5. Generate JWT token (24-hour expiry)
6. Store in secure HTTP-only cookie
7. Redirect to dashboard
8. Include JWT in all API requests

### Security Features:
- Password hashing (bcrypt)
- JWT token authentication
- CSRF protection
- Rate limiting on login endpoint (5 attempts per 5 minutes)
- Session timeout (30 minutes idle)
- IP logging for all admin actions
- Activity audit trail for all changes
- Email notification on new admin login
- Two-factor authentication (optional enhancement)

---

## API ENDPOINTS REQUIRED

### Authentication:
- `POST /api/admin/login` - Authenticate admin
- `POST /api/admin/logout` - Logout session
- `POST /api/admin/refresh-token` - Refresh JWT token
- `GET /api/admin/me` - Get current admin info

### Products:
- `GET /api/admin/products` - List products with filters
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/:id` - Get product details
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/products/bulk-update` - Bulk update
- `POST /api/admin/products/import` - CSV import

### Orders:
- `GET /api/admin/orders` - List orders with filters
- `GET /api/admin/orders/:id` - Get order details
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/payment` - Update payment status
- `POST /api/admin/orders/:id/tracking` - Add tracking
- `POST /api/admin/orders/:id/notes` - Add internal notes
- `POST /api/admin/orders/:id/send-update` - Send WhatsApp update
- `POST /api/admin/orders/export` - Export orders as CSV

### Bespoke Requests:
- `GET /api/admin/bespoke` - List bespoke requests
- `GET /api/admin/bespoke/:id` - Get bespoke details
- `PUT /api/admin/bespoke/:id/status` - Update status
- `POST /api/admin/bespoke/:id/quote` - Send quote
- `POST /api/admin/bespoke/:id/progress` - Add progress note
- `POST /api/admin/bespoke/:id/convert-order` - Convert to order

### Customers:
- `GET /api/admin/customers` - List customers
- `GET /api/admin/customers/:id` - Get customer details
- `POST /api/admin/customers/:id/send-message` - WhatsApp message
- `PUT /api/admin/customers/:id/notes` - Add notes

### Analytics:
- `GET /api/admin/analytics/dashboard` - Dashboard metrics
- `GET /api/admin/analytics/sales` - Sales analytics
- `GET /api/admin/analytics/products` - Product analytics
- `GET /api/admin/analytics/customers` - Customer analytics
- `POST /api/admin/analytics/export-report` - Export as PDF

### Admin Management:
- `GET /api/admin/admins` - List admins
- `POST /api/admin/admins` - Create admin
- `PUT /api/admin/admins/:id` - Update admin
- `DELETE /api/admin/admins/:id` - Delete admin

### Settings:
- `GET /api/admin/settings` - Get all settings
- `PUT /api/admin/settings` - Update settings
- `PUT /api/admin/email-templates/:template` - Update email template
- `PUT /api/admin/whatsapp-templates/:template` - Update WhatsApp template

### Activity Logs:
- `GET /api/admin/logs` - Get activity logs
- `POST /api/admin/logs/export` - Export logs as CSV

---

## NOTIFICATIONS & INTEGRATIONS

### WhatsApp Integration:
- Send order updates to customer WhatsApp
- Send bespoke request responses
- Send promotional messages
- Use existing number: 08122815425
- Pre-written templates for common scenarios

### Email Integration:
- Send order confirmations
- Send shipping notifications
- Send bespoke quotes
- Send promotional emails
- HTML templates with branding

### Cloudinary Integration:
- Upload product images
- Upload bespoke design sketches
- Upload reference images
- Organize by folder structure

### PDF Generation:
- Invoice generation
- Order confirmation
- Shipping label
- Analytics reports
- Receipt

---

## USER WORKFLOWS & EXAMPLES

### Workflow 1: New Product Addition
1. Admin clicks "Create Product"
2. Fills form: name, category, description, fabric, price, sizes
3. Uploads 3-5 images to Cloudinary
4. Sets stock quantity and SKU (auto-generated)
5. Marks as featured if needed
6. Publishes product
7. Product appears on website immediately
8. Admin can view it on the store

### Workflow 2: Order Processing
1. Customer places order on website
2. Order appears in admin pending list
3. Admin verifies payment reference
4. Admin marks payment as confirmed
5. Order status changes to processing
6. Admin picks items and updates status to shipped
7. Admin adds tracking number
8. System auto-sends tracking via WhatsApp to customer
9. Order marked as delivered
10. System can request feedback

### Workflow 3: Bespoke Order Management
1. Customer submits bespoke request with details
2. Request appears in Bespoke section as "new"
3. Admin reviews, assigns to designer
4. Designer uploads design sketches
5. Admin sends quote to customer via WhatsApp
6. Customer accepts quote
7. Admin marks as "in_production"
8. Team updates progress regularly
9. When complete, admin marks as "completed"
10. Admin can convert to actual order
11. Order is created and customer is notified

### Workflow 4: Inventory Management
1. Admin notices low stock alert (< 10 items)
2. Admin can create bulk order reminder
3. Admin can temporarily hide out-of-stock items
4. Admin can set as "discontinued" permanently
5. Admin can import stock updates via CSV

---

## DASHBOARD LAYOUT SPECIFICATION

**Top Navigation Bar:**
- Fifi Fashion Wears logo/text (left)
- Search bar (center)
- Notifications bell (admin alerts)
- Admin profile dropdown (right)
  - Profile
  - Settings
  - Logout

**Sidebar Menu:**
- Dashboard (icon: home)
- Products (icon: shopping-bag)
- Orders (icon: box)
- Bespoke Requests (icon: scissors)
- Customers (icon: users)
- Analytics (icon: bar-chart)
- Admins (icon: shield)
- Settings (icon: cog)
- Activity Logs (icon: history)

**Dashboard Cards Layout:**
- Top row: 4 KPI cards (total orders, revenue, pending orders, bespoke requests)
- Middle row: 2 charts (revenue trend, orders by status)
- Bottom row: Quick action buttons + recent activity table

---

## RESPONSE TO COMMON ADMIN SCENARIOS

**Scenario 1: Customer asks about order status**
- Admin goes to Orders
- Searches by customer email
- Finds order
- Can see all details and history
- Can send WhatsApp update immediately
- Can add internal notes for follow-up

**Scenario 2: Product out of stock**
- Admin sees low stock alert
- Can immediately set to inactive
- Customer sees "Out of Stock" on website
- Can update when stock arrives
- CSV import for bulk stock update

**Scenario 3: Bespoke order delayed**
- Admin accesses Bespoke request
- Updates status to "in_progress"
- Adds progress notes
- Sends WhatsApp update to customer
- Extends deadline if needed
- Tracks all communications

**Scenario 4: Need to export sales data**
- Admin goes to Analytics
- Selects date range
- Chooses metrics
- Clicks Export
- Gets CSV or PDF report
- Can email to team/accountant

---

## TECHNICAL REQUIREMENTS SUMMARY

**Frontend (Already built):**
- React + TypeScript
- Tailwind CSS for styling
- All customer-facing features complete

**Admin Panel to Build:**
- React component-based architecture
- Protected routes with JWT authentication
- Form validation
- Loading states and error handling
- Responsive design (works on tablet/desktop)
- Real-time data updates (optional: WebSocket)
- Data tables with sorting, filtering, pagination
- Charts using chart library (Recharts or Chart.js)
- File upload for images and CSV
- Print functionality

**Backend APIs:**
- Node.js / Express (or similar)
- Supabase PostgreSQL for persistence
- JWT authentication
- Middleware for permission checking
- Rate limiting
- Error handling and logging
- Email service integration
- WhatsApp API integration
- File upload to Cloudinary
- PDF generation library

**Database:**
- Supabase PostgreSQL (already configured)
- Tables as defined above
- Indexes on frequently queried fields
- Relationships between tables
- Row-level security policies

**Hosting:**
- Frontend: Vercel (already using)
- Backend: Vercel / AWS / DigitalOcean
- Database: Supabase (already configured)
- File storage: Cloudinary (already configured)

---

## SUCCESS CRITERIA

✅ Admins can fully manage all products (CRUD)  
✅ Orders are processed from creation to delivery  
✅ Bespoke requests are tracked through completion  
✅ All actions are logged and auditable  
✅ Notifications sent via WhatsApp and email  
✅ Analytics provide business insights  
✅ System is secure and performant  
✅ Mobile-responsive admin panel  
✅ Easy to use with no training needed  
✅ All data properly persisted in Supabase  

---

## NEXT STEPS FOR AI IMPLEMENTATION

When building this system with an AI:

1. **Phase 1 - Backend Setup**
   - Create all database tables in Supabase
   - Build authentication system (login, JWT, sessions)
   - Create API endpoints for all operations
   - Add middleware for auth and permissions
   - Implement audit logging

2. **Phase 2 - Admin Pages**
   - Build login page
   - Build dashboard with analytics
   - Build product management pages
   - Build order management pages
   - Build bespoke request pages

3. **Phase 3 - Features**
   - Notifications (WhatsApp, Email)
   - File uploads (Cloudinary)
   - CSV import/export
   - PDF generation
   - Charts and analytics

4. **Phase 4 - Polish**
   - Error handling
   - Loading states
   - Validation
   - Security hardening
   - Performance optimization
   - Testing

---

## CONTACT & BRAND INFO

**Brand:** Fifi Fashion Wears - LE LUXE Collection  
**Phone:** 08122815425 (WhatsApp)  
**Email:** fififashionwears@gmail.com  
**Website:** https://fififashion.shop  
**Admin Panel:** https://fififashion.shop/admin-panel  
**Instagram:** @fifi_fashion_wears1  

---

**This prompt is comprehensive and production-ready. Share this with any AI engine to get a fully functional admin panel built!**
