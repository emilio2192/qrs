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
│   │   ├── api/       # API routes
│   │   │   └── auth/  # Authentication routes
│   │   ├── cart/      # Cart page
│   │   ├── checkout/  # Checkout page
│   │   └── profile/   # User profile page
│   ├── components/    # Reusable UI components
│   ├── lib/          # Business logic and utilities
│   │   ├── prisma.ts # Prisma client instance
│   │   ├── store.ts  # Redux store configuration
│   │   └── services/ # Business logic services
│   └── hooks/        # Custom React hooks
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
- **JWT Tokens** - Secure authentication with 24-hour expiration
- **Password Hashing** - bcrypt with 12 salt rounds for password security
- **Protected Routes** - Middleware for API protection
- **User Types** - VIP and COMMON user support
- **Token Storage** - Client-side localStorage with useAuthToken hook
- **Token Verification** - Endpoint to verify JWT token validity and expiration
- **Client-side Validation** - useAuthToken hook with validateToken function

## 📝 Environment Variables

Create a `.env.local` file in the root directory (or use `.env.example` as a template):

```env
# Database
DATABASE_URL="postgresql://qrs_user:qrs_password@localhost:5432/qrs_db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### Environment Variables Explained

- **DATABASE_URL**: PostgreSQL connection string for Prisma
- **JWT_SECRET**: Secret key for signing JWT tokens (change in production!)
- **NEXT_PUBLIC_APP_URL**: Public URL for the application
- **NODE_ENV**: Environment mode (development/production)

### Vercel Environment Variables
- Vercel does **not** use `.env` files from your repo for security reasons.
- Instead, add environment variables in the Vercel dashboard (or with `vercel env` CLI) using the same keys as above.
- Keep `.env.example` in your repo to document required variables for all environments.

## 🔐 Authentication API

### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "COMMON",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "COMMON",
    "isActive": true
  },
  "token": "jwt_token_here"
}
```

### Error Responses
Both endpoints return error responses in this format:
```json
{
  "error": "Error message here"
}
```

### Token Verification
```bash
POST /api/auth/verify
Content-Type: application/json

{
  "token": "your-jwt-token-here"
}
```

**Response (Valid Token):**
```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "COMMON",
    "isActive": true
  },
  "token": "jwt_token_here",
  "expiresAt": "2024-01-02T00:00:00.000Z"
}
```

**Response (Invalid/Expired Token):**
```json
{
  "error": "Token expired"
}
```

### Protected Routes
All cart and product APIs require authentication. Include the JWT token in the Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```

### Frontend Token Validation

Use the `useAuthToken` hook to validate tokens in your components:

```typescript
import { useAuthToken } from '@/hooks/useAuthToken';

function MyComponent() {
  const { validateToken, isValidating } = useAuthToken();

  const checkToken = async () => {
    const result = await validateToken();
    
    if (result.isValid) {
      console.log('Token is valid, user:', result.user);
    } else {
      console.log('Token is invalid:', result.error);
      // Token will be automatically removed from storage
    }
  };

  return (
    <button onClick={checkToken} disabled={isValidating}>
      {isValidating ? 'Validating...' : 'Check Token'}
    </button>
  );
}
```

### Security Features
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Expiration**: 24-hour token expiration
- **Input Validation**: Email format and password length validation
- **Error Handling**: Generic error messages to prevent information leakage
- **Token Verification**: Comprehensive JWT validation including expiration and user status checks
- **Auto-cleanup**: Invalid/expired tokens are automatically removed from storage

## 🛒 Cart Architecture: Redux + Cookies (SSR Compatible)

This project uses **Redux Toolkit** with **cookies** to manage the shopping cart, ensuring full SSR (Server-Side Rendering) compatibility and persistence across sessions.

### How It Works
- **Redux Toolkit** manages the cart state globally across your app
- **Cart state is persisted in cookies** (`qrs_cart`) so it survives page reloads, browser restarts, and is available for SSR
- **Redux Provider** is configured for Next.js App Router compatibility
- **Cart actions** include add, update, remove, and clear operations
- **Automatic cookie sync** - cart state is automatically saved to cookies on every change

### Why This Approach?
- **SSR/SEO:** Cart contents are available on first render, even for bots/crawlers
- **Persistence:** Cart survives browser restarts and is available across tabs
- **Type Safety:** Full TypeScript support with Redux Toolkit
- **Developer Experience:** Redux DevTools support for debugging
- **Scalability:** Easy to extend for authenticated users (e.g., sync with database)

### Usage in Components
- Use `useSelector` from `react-redux` to access cart state:
  ```typescript
  import { useSelector } from 'react-redux';
  import { AppState } from '@/lib/store';
  
  const cartItems = useSelector((state: AppState) => state.cart.items);
  const cartItemCount = useSelector((state: AppState) => 
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  ```

- Use `useDispatch` to add, update, or remove items:
  ```typescript
  import { useDispatch } from 'react-redux';
  import { addItem, updateItemQuantity, removeItem, clearCart } from '@/lib/store';
  
  const dispatch = useDispatch();
  
  // Add item to cart
  dispatch(addItem({ 
    productId: 'product-id', 
    size: 'M', 
    quantity: 1 
  }));
  
  // Update quantity
  dispatch(updateItemQuantity({ 
    productId: 'product-id', 
    size: 'M', 
    quantity: 2 
  }));
  
  // Remove item
  dispatch(removeItem({ 
    productId: 'product-id', 
    size: 'M' 
  }));
  
  // Clear entire cart
  dispatch(clearCart());
  ```

### Redux Store Structure
```typescript
interface CartState {
  items: CartItem[];
}

interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}
```

### SSR and Hydration
- The cart is available on both server and client thanks to cookies
- **Client-side only rendering** prevents hydration mismatches
- Cart state is properly synchronized between server and client

### Testing
- Tests use a Redux provider and can dispatch cart actions directly
- See `src/test/utils/renderWithIntl.tsx` for the test setup

### Migration Notes
- The old sessionStorage-based cart system has been completely removed
- All cart operations are now Redux actions/selectors
- Cart state is automatically persisted in cookies

---

## 🚀 Deployment

The application is deployed to Vercel for production. **No Dockerfile is needed for production or development.**

### Local Development with Docker Compose
- The `nextjs` service in `docker-compose.yml` uses the official `node:18-alpine` image.
- Your code is mounted as a volume, and the container runs `npm install` and `npm run dev` for hot-reload.
- This setup is for local development only.

## 📄 License

This project is created for the QRS Shopping Cart Challenge.

## Database Setup (PostgreSQL via Docker)

This project uses Docker to run PostgreSQL with persistent storage. Follow these steps to set up, reset, and seed your database:

### 1. Start PostgreSQL with Docker

```
npm run docker:up
```

This will start the PostgreSQL container defined in `docker-compose.yml` and create a persistent volume (`qrs_postgres_data`).

### 2. Generate Prisma Client

```
npm run db:generate
```

### 3. Push the Prisma Schema to the Database

```
npm run db:push
```

### 4. Seed the Database (Test Users & Sample Data)

```
npm run db:seed
```

This will create:
- Sample banners, categories, and products
- Two test users:
  - Common user: `common@example.com` / `password123`
  - VIP user: `vip@example.com` / `password123`

### 5. Open Prisma Studio (Optional)

```
npm run db:studio
```

This opens a web UI at http://localhost:5555 to inspect and edit your database.

### Resetting the Database

To reset the database (wipe all data and start fresh):

1. **Stop the database:**
   ```sh
   npm run docker:down
   ```
2. **Remove the Docker volume:**
   ```sh
   docker volume rm qrs_postgres_data
   ```
3. **Start the database again:**
   ```sh
   npm run docker:up
   ```
4. **Repeat steps 2–4 above** (generate, push, seed).

---

## Notes
- The database connection details are configured in your `.env` file.
- Only Docker is used for PostgreSQL; all other services run locally.
- If you change the Prisma schema, always re-run `npm run db:generate` and `npm run db:push`.

## Architecture & Design Decisions

This project is built with a focus on simplicity, maintainability, and a good user experience. Here are the main points about how it is structured and why:

- **Next.js App Router**: The app uses Next.js 13+ App Router for both frontend and backend. Pages are server-rendered for better SEO and fast loading. API routes are used for backend logic (like checkout and authentication).

- **Prisma ORM**: Prisma is used to talk to the PostgreSQL database. It makes database queries easy and safe, and helps keep the code clean.

- **PostgreSQL with Docker**: The database runs in a Docker container. This makes it easy to set up and reset the database for development. You don't need to install Postgres on your computer.

- **Redux Toolkit**: The cart is managed with Redux Toolkit for global state management. Cart state is persisted in cookies for SSR compatibility and cross-session persistence. This provides a better user experience than sessionStorage.

- **Promotion Logic**: All discount and promotion calculations are done in a single utility function. This makes it easy to test and update the rules. The logic always tries to give the customer the best deal, and VIP users can choose which discount to use.

- **Authentication**: JWT tokens are used for login. User info and tokens are stored in localStorage. The app supports both common and VIP users.
  - JWT tokens expire in 24 hours for security.

- **Order History**: Orders are saved in the database with the promotion used and the final price. The order history page shows all details, including the discount applied.

- **Testing**: The promotion logic is covered by unit tests to make sure all scenarios work as expected.

- **Why these choices?**
  - Next.js and Prisma are popular, well-supported, and easy to use.
  - Docker makes development setup simple for everyone.
  - Redux Toolkit provides excellent TypeScript support and developer experience.
  - Keeping business logic (like promotions) in one place makes the app easier to maintain and test.

## Improvements (Planned or Possible)

- **Hybrid Cart Sync**: The database already supports tracking abandoned carts. A future improvement is to implement hybrid cart logic: when a user logs in or out, the cart in Redux will be synced with the database. This way, users can keep their cart across devices or after logging in.
- More advanced admin features, order status tracking, and better error handling can be added as needed. 
