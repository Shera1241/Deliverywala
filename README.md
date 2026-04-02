# 🚚 Deliverywala

An open source delivery and logistics management platform built with Next.js, Prisma, and PostgreSQL.

## Features

- **Customer Portal** — Place delivery orders and track them in real-time
- **Agent Dashboard** — Delivery agents can accept orders and update delivery status
- **Admin Panel** — Full control over users, orders, and agent assignments
- **Role-based Auth** — JWT-based authentication with CUSTOMER, AGENT, and ADMIN roles

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: PostgreSQL + Prisma 7 ORM
- **Auth**: NextAuth.js v5 (Credentials provider)
- **Styling**: Tailwind CSS
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/shera1241/deliverywala.git
cd deliverywala
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection string and a secret key:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/deliverywala"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Run database migrations**

```bash
npm run db:migrate
```

5. **Seed the database** (optional — creates demo users)

```bash
npm run db:seed
```

Demo credentials after seeding:

| Role     | Email                        | Password     |
|----------|------------------------------|--------------|
| Admin    | admin@deliverywala.com       | admin123!    |
| Agent    | agent@deliverywala.com       | agent123!    |
| Customer | customer@deliverywala.com    | customer123! |

6. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
deliverywala/
├── app/
│   ├── (pages)/
│   │   ├── page.tsx              # Landing page
│   │   ├── login/                # Login
│   │   ├── register/             # Registration
│   │   ├── dashboard/            # Role-based dashboard
│   │   ├── orders/               # Order detail & new order
│   │   ├── agent/                # Agent dashboard
│   │   └── admin/                # Admin panel (orders & users)
│   └── api/
│       ├── auth/                 # NextAuth + register endpoint
│       ├── orders/               # Order CRUD
│       └── admin/                # Admin user management
├── components/                   # Shared UI components
├── lib/
│   ├── prisma.ts                 # Prisma client instance
│   ├── auth.ts                   # NextAuth config
│   └── db.ts                     # Prisma type re-exports
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeder
└── types/                        # TypeScript type augmentations
```

## API Endpoints

| Method | Endpoint                    | Auth          | Description                  |
|--------|-----------------------------|---------------|------------------------------|
| POST   | `/api/auth/register`        | Public        | Register a new user          |
| POST   | `/api/auth/signin`          | Public        | Sign in (NextAuth)           |
| GET    | `/api/orders`               | Any auth      | List orders (role-filtered)  |
| POST   | `/api/orders`               | Customer      | Place a new order            |
| GET    | `/api/orders/:id`           | Owner/Admin   | Get order details            |
| PATCH  | `/api/orders/:id`           | Role-based    | Update order status/agent    |
| GET    | `/api/admin/users`          | Admin only    | List all users               |
| PATCH  | `/api/admin/users/:id`      | Admin only    | Change user role             |
| DELETE | `/api/admin/users/:id`      | Admin only    | Delete a user                |

## License

MIT — free to use and modify.
