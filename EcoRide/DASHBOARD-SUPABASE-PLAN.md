# EcoRide Dashboard — Completion & Supabase Plan

This document separates what is already implemented in the static dashboard from the parts that require a real backend.

## Phase 1 — Dashboard UI (done in this package)

- Premium dark admin shell with green accent.
- Responsive sidebar, mobile drawer, header search, notifications and profile menu.
- Dashboard overview with truthful catalog KPIs.
- Product management: search, filter, sort, add, edit, delete, reset.
- Local persistence for dashboard product edits.
- Order Center based on the existing browser cart, explicitly labeled as a checkout draft rather than a paid order.
- Support Messages inbox using the existing storefront contact form, stored locally in the same browser.
- Review moderation surface prepared for real review records without pretending the current static review cards are database rows.
- Settings: theme, compact mode, RTL preference, JSON export and local-data reset.
- Storefront bridge: product edits saved from the admin preview are reflected in the storefront in the same browser.

## Phase 2 — Supabase project setup (manual account step)

1. Create a Supabase project.
2. Create the database tables listed below.
3. Enable Authentication for admin users.
4. Create a Storage bucket for product images.
5. Add Row Level Security policies.
6. Create production environment variables; never commit the service role key.

## Phase 3 — Database model

### `products`

- `id` uuid primary key
- `category` text not null
- `name` text not null
- `description` text
- `price` numeric not null
- `image_path` text
- `status` text default `active`
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

### `orders`

- `id` uuid primary key
- `customer_name` text
- `customer_email` text
- `customer_phone` text
- `status` text default `pending`
- `subtotal` numeric
- `total` numeric
- `currency` text default `USD`
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

### `order_items`

- `id` uuid primary key
- `order_id` uuid references `orders(id)` on delete cascade
- `product_id` uuid references `products(id)`
- `quantity` integer not null
- `unit_price` numeric not null

### `messages`

- `id` uuid primary key
- `name` text not null
- `email` text not null
- `subject` text
- `message` text not null
- `status` text default `new`
- `created_at` timestamptz default now()

### `reviews`

- `id` uuid primary key
- `product_id` uuid references `products(id)`
- `name` text
- `rating` integer
- `title` text
- `body` text
- `status` text default `pending`
- `created_at` timestamptz default now()

### `profiles`

- `id` uuid primary key references `auth.users(id)`
- `display_name` text
- `role` text default `admin`
- `created_at` timestamptz default now()

## Phase 4 — Security

- Only authenticated admins can enter the dashboard.
- RLS must prevent anonymous users from reading admin-only data.
- Public storefront reads only active products.
- Messages can be inserted by the public contact form through a narrowly scoped path and read only by admins.
- Orders are readable/writable only according to the chosen checkout architecture.
- Storage policies must limit uploads and deletes to authorized admins.

## Phase 5 — Code integration

Replace localStorage data sources with Supabase queries in this order:

1. Products.
2. Messages.
3. Orders + order items.
4. Reviews.
5. Profiles/Auth.
6. Storage image uploads.

Do not change the visual shell while connecting the backend. Keep UI selectors stable so browser tests remain reliable.

## Phase 6 — Verification

Run a browser test pass for:

- Login / logout.
- Dashboard load.
- Product search and filters.
- Add, edit and delete product.
- Image upload.
- Message submission + inbox read/mark-read.
- Order creation and status change.
- Review moderation.
- RTL/LTR.
- Dark/light theme.
- Mobile navigation.

## Phase 7 — Deployment

Recommended sequence:

`Local → Preview → browser QA → visual QA → Production`

Never deploy secrets in static files. Store public Supabase URL/anon key in environment/config as appropriate, and keep the service role key server-side only.

## Important truthfulness rule

Do not create Revenue, Customers, Paid Orders, Traffic or Stock KPIs until the matching backend data exists. The dashboard should always distinguish between:

- real backend data,
- browser-local preview data,
- static storefront content.
