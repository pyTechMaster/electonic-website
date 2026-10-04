# Tinkerleaf Backend + MongoDB

This version adds a real Node.js/Express API and MongoDB database while keeping the existing Tinkerleaf frontend.

## 1. Install Node.js
Install Node.js LTS on Windows.

## 2. Install packages
Open Command Prompt inside the `Electonic website` folder:

```bash
npm install
```

## 3. Create MongoDB database
Create a free MongoDB Atlas cluster, create a database user, allow your IP, and copy the MongoDB connection string.

Copy `.env.example` to `.env` and set:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=3000
NODE_ENV=development
```

## 4. Import the existing store products
```bash
npm run seed-products
```

## 5. Create admin account
```bash
npm run create-admin -- admin@example.com StrongPassword123
```

## 6. Start Tinkerleaf
```bash
npm start
```

Open: `http://localhost:3000`

## API included
- `/api/auth/register` — create account
- `/api/auth/login` — secure login with HTTP-only cookie
- `/api/auth/me` — current account
- `/api/auth/logout` — logout
- `/api/products` — product database
- `/api/orders` — save orders
- `/api/orders/my` — customer order history
- `/api/admin/orders` — admin order list
- `/api/admin/orders/:orderId/status` — update order status
- `/api/wishlist` — account wishlist
- `/api/admin/stats` — admin counts

Passwords are hashed with bcrypt and are not stored as plain text.

### Important
Real Razorpay/card/UPI gateway processing still requires your own Razorpay account keys and server-side payment verification. This package does **not** fake successful payments.
