# QRS Shopping Cart Challenge

A Next.js application with shopping cart functionality, promotional campaigns, and differentiated pricing based on user type.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qrs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start PostgreSQL with Docker**
   ```bash
   npm run docker:up
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run docker:up` - Start PostgreSQL container
- `npm run docker:down` - Stop PostgreSQL container
- `npm run docker:logs` - View container logs
- `npm run docker:restart` - Restart containers
- `npm run db:push` - Push schema to database (dev only)
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

## 🗄️ Database

The application uses PostgreSQL with Prisma:

- **Host:** localhost
- **Port:** 5432
- **Database:** qrs_db
- **Username:** qrs_user
- **Password:** qrs_password

### Prisma Features
- **Schema-first approach** - Define models in `prisma/schema.prisma`
- **Type-safe queries** - Full TypeScript support
- **Auto-generated client** - Run `npm run db:generate` after schema changes
- **Database migrations** - Use `prisma migrate` for production
- **Prisma Studio** - Visual database browser with `npm run db:studio`

### Test Users
After seeding, you can test with these users:
- **VIP User:** `vip@example.com` / `password123`
- **Common User:** `common@example.com` / `password123`

## 📁 Project Structure

```
qrs/
├── src/
│   ├── app/           # Next.js App Router
│   │   └── api/       # API routes
│   │       └── auth/  # Authentication routes
│   ├── components/    # Reusable UI components
│   ├── lib/          # Business logic and utilities
│   │   ├── prisma.ts # Prisma client instance
│   │   └── auth.ts   # Authentication utilities
│   └── context/      # React Context providers
├── prisma/           # Prisma configuration
│   ├── schema.prisma # Database schema
│   └── seed.ts       # Database seeding
├── docker/           # Docker configuration
├── public/           # Static assets
└── tests/           # Test files
```

## 🧪 Development

### Code Quality
- **ESLint** - Code linting with Next.js and Prettier integration
- **Prettier** - Code formatting
- **TypeScript** - Type safety

### Database
- **PostgreSQL** - Primary database
- **Prisma** - Type-safe ORM with excellent Next.js integration
- **Docker** - Containerized development environment

### Authentication
- **JWT Tokens** - Secure authentication
- **Password Hashing** - bcrypt for password security
- **Protected Routes** - Middleware for API protection
- **User Types** - VIP and COMMON user support

## 📝 Environment Variables

Create a `.env.local` file in the root directory (or use `.env.example` as a template):

```env
# Database
DATABASE_URL="postgresql://qrs_user:qrs_password@localhost:5432/qrs_db"

# Authentication
JWT_SECRET="your-secret-key-change-in-production"

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Environment Variables
- Vercel does **not** use `.env` files from your repo for security reasons.
- Instead, add environment variables in the Vercel dashboard (or with `vercel env` CLI) using the same keys as above.
- Keep `.env.example` in your repo to document required variables for all environments.

## 🔐 Authentication API

### Signup
```bash
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "userType": "COMMON" // or "VIP"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Protected Routes
All cart and product APIs require authentication. Include the JWT token in the Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```

## 🚀 Deployment

The application is deployed to Vercel for production. **No Dockerfile is needed for production or development.**

### Local Development with Docker Compose
- The `nextjs` service in `docker-compose.yml` uses the official `node:18-alpine` image.
- Your code is mounted as a volume, and the container runs `npm install` and `npm run dev` for hot-reload.
- This setup is for local development only.

## 📄 License

This project is created for the QRS Shopping Cart Challenge.
