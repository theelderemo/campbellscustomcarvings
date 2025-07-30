# Admin Dashboard Setup

## Overview
The admin dashboard provides a secure area for shop owners to manage products, view orders, and handle custom order requests without direct database interaction.

## Features

### Authentication & Authorization
- **Secure Login**: Admin users must authenticate using email/password
- **Role-Based Access**: Only users with 'admin' role can access the dashboard
- **Registration**: Ability to create new admin accounts
- **Automatic Redirects**: Unauthorized users are redirected to login
- **Navbar Integration**: Login/logout functionality integrated into the main navigation
- **Role-Based Navigation**: Admins see "Admin" button, customers see "My Account" button

### Dashboard Pages
1. **Dashboard** (`/admin`) - Overview with statistics and recent orders
2. **Products** (`/admin/products`) - Manage product catalog
3. **Orders** (`/admin/orders`) - View and manage customer orders
4. **Custom Orders** (`/admin/custom-orders`) - Handle custom order requests

### Customer Account Area
1. **Account Dashboard** (`/account`) - Customer's personal account area
2. **Order History** - View past orders and their status
3. **Custom Order Requests** - Track custom order requests
4. **Quick Actions** - Links to shop and create custom orders

## Database Requirements

### User Profiles Table
The system requires a `user_profiles` table in Supabase with the following structure:

```sql
CREATE TABLE user_profiles (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  email text not null,
  first_name text not null,
  last_name text not null,
  phone text null,
  role text null default 'customer'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint user_profiles_role_check check (
    (
      role = any (array['customer'::text, 'admin'::text])
    )
  )
) TABLESPACE pg_default;

-- Enable RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow insert during registration" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Required Tables
The admin dashboard also requires these existing tables:
- `products` - Product catalog
- `orders` - Customer orders
- `custom_orders` - Custom order requests

## Setup Instructions

### 1. Database Setup
1. Create the `user_profiles` table using the SQL above
2. Ensure other required tables exist (`products`, `orders`, `custom_orders`)

### 2. Environment Variables
Ensure these environment variables are set:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. User Authentication Options

#### Option A: Create Admin via Navbar (Recommended)
1. Visit the homepage
2. Click "Sign In" in the navbar
3. Click "Don't have an account? Create one"
4. Enter email and password to create a customer account
5. Manually update the user's role to 'admin' in the database:
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
   ```

### 4. User Access
- **Admins**: Can access `/admin` dashboard and all admin features
- **Customers**: Can access `/account` page to view their orders and requests
- **Authentication**: Navbar shows appropriate buttons based on login status and role

## Security Features

### Multi-Layer Protection
1. **Middleware Protection**: Routes starting with `/admin` are protected
2. **Component Protection**: `AdminProtected` component wraps sensitive content
3. **Role Verification**: Both client and server-side role checking
4. **Automatic Redirects**: Unauthorized users redirected to login

### Access Control Flow
1. User visits `/admin/*` route
2. Middleware checks authentication
3. If authenticated, middleware verifies admin role
4. Component-level protection provides additional security
5. Dashboard content only loads for verified admins

## File Structure

### Core Files
- `src/lib/actions.ts` - Authentication and role checking functions
- `src/lib/types.ts` - TypeScript type definitions
- `src/middleware.ts` - Route protection middleware
- `src/components/admin/AdminProtected.tsx` - Component-level protection
- `src/components/Navbar.tsx` - Navigation with authentication integration
- `src/components/AuthModal.tsx` - Login/registration modal component

### Admin Pages
- `src/app/admin/layout.tsx` - Admin dashboard layout
- `src/app/admin/page.tsx` - Main dashboard
- `src/app/admin/login/page.tsx` - Login/registration page
- `src/app/admin/products/page.tsx` - Product management
- `src/app/admin/orders/page.tsx` - Order management
- `src/app/admin/custom-orders/page.tsx` - Custom order management

### Customer Pages
- `src/app/account/page.tsx` - Customer account dashboard

### Admin Components
- `src/components/admin/ProductForm.tsx` - Product creation/editing
- `src/components/admin/ProductsTable.tsx` - Product listing
- `src/components/admin/OrdersTable.tsx` - Order listing
- `src/components/admin/CustomOrdersTable.tsx` - Custom order listing

## Usage

### User Authentication
1. **Sign Up/Sign In**: Click "Sign In" in the navbar to access the authentication modal
2. **Role-Based Redirect**: Users are automatically redirected based on their role:
   - Admins → `/admin` dashboard
   - Customers → `/account` page
3. **Sign Out**: Click the user avatar or "Sign Out" button in the navbar

### Managing Products
1. Navigate to `/admin/products`
2. Click "Add Product" to create new products
3. Click edit icon to modify existing products
4. Click delete icon to remove products

### Managing Orders
1. Navigate to `/admin/orders`
2. View all customer orders
3. Update order status as needed
4. View order details and customer information

### Managing Custom Orders
1. Navigate to `/admin/custom-orders`
2. Review custom order requests
3. Update status and add notes
4. View customer requirements and budget

### Customer Account Management
1. Navigate to `/account` (customers only)
2. View order history and status
3. Track custom order requests
4. Access quick actions for shopping

## Troubleshooting

### Common Issues
1. **"Unauthorized" Error**: Ensure user has admin role in user_profiles table
2. **Login Loop**: Check if user_profiles table exists and has correct structure
3. **Database Errors**: Verify Supabase connection and table permissions

### Debug Steps
1. Check browser console for error messages
2. Verify Supabase environment variables
3. Ensure user_profiles table has correct RLS policies
4. Check that admin user exists with correct role

## Security Considerations

### Best Practices
- Admin accounts should use strong passwords
- Regularly review admin user list
- Monitor admin access logs
- Keep Supabase credentials secure
- Use HTTPS in production

### Access Control
- Admin role is verified on every request
- Middleware blocks unauthorized access
- Component-level protection prevents UI access
- Database RLS policies provide final security layer
