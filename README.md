# AgoraNet Frontend

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-teal)
![License](https://img.shields.io/badge/License-MIT-yellow)

A modern marketplace frontend for buying and selling second-hand items, built with React, TypeScript, Vite and TailwindCSS.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [State Management](#state-management)
- [API Layer](#api-layer)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS v4
- **UI Components:** shadcn/ui (Nova preset)
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router v7
- **Notifications:** Sonner
- **Icons:** Lucide React
- **Font:** Geist Variable

## Features

- JWT Authentication with automatic session expiry handling
- Automatic token expiry detection with user notification
- Session expired toast that persists until re-login
- Public and protected routes
- Product browsing with search, category filtering and pagination
- Product detail page with image gallery
- Wishlist with toggle functionality
- Buy Now checkout flow
- Order management with status tracking (pending, confirmed, cancelled)
- Leave review for sellers after confirmed orders
- Seller dashboard with product and order management
- Product form with image upload, preview and deletion
- Become a seller flow with profile validation
- User profile with avatar, stats and reviews
- Edit profile with password change validation
- Toast notifications for all user actions
- Empty states for wishlist, orders and products
- 404 page
- Responsive design

## Prerequisites

- Node.js >= 24.13.0
- npm >= 11.6.2
- AgoraNet Backend running on `http://localhost:3000`

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/SifisKakavelakis/agoranet-frontend.git
cd agoranet-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000/api
VITE_BASE_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

The app will start on `http://localhost:5173`

## Project Structure

src/
├── api/ # API layer
│ ├── axios.ts # Axios instance with interceptors
│ ├── auth.api.ts # Authentication API functions
│ ├── user.api.ts # User API functions
│ ├── product.api.ts # Product API functions
│ ├── order.api.ts # Order API functions
│ ├── review.api.ts # Review API functions
│ └── wishlist.api.ts # Wishlist API functions
├── components/ # Reusable components
│ ├── ui/ # shadcn/ui components
│ ├── Layout.tsx # App layout with Navbar and CategoryBar
│ ├── Navbar.tsx # Navigation bar
│ ├── CategoryBar.tsx # Category filter bar
│ ├── ProductCard.tsx # Product card with wishlist toggle
│ ├── ReviewModal.tsx # Leave review modal
│ ├── ProtectedRoute.tsx # Auth guard component
│ ├── login-form.tsx # Login form
│ └── signup-form.tsx # Registration form
├── pages/ # Application pages
│ ├── seller/ # Seller-only pages
│ │ ├── MyProductsPage.tsx
│ │ ├── IncomingOrdersPage.tsx
│ │ └── ProductFormPage.tsx
│ ├── LoginPage.tsx
│ ├── RegisterPage.tsx
│ ├── HomePage.tsx
│ ├── ProductDetailPage.tsx
│ ├── CheckoutPage.tsx
│ ├── MyOrdersPage.tsx
│ ├── ProfilePage.tsx
│ ├── EditProfilePage.tsx
│ ├── WishlistPage.tsx
│ ├── BecomeSellerPage.tsx
│ └── NotFoundPage.tsx
├── store/ # Zustand stores
│ └── authStore.ts # Authentication state
├── lib/ # Utilities
│ └── utils.ts
├── App.tsx # Root component with routing
├── main.tsx # Entry point
└── index.css # Global styles and theme


## Pages

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Product grid with search, filters and pagination |
| Product Detail | `/products/:id` | Product images, info, seller link and buy button |
| Profile | `/profile/:username` | User profile with avatar, stats and reviews |
| Login | `/login` | Login form |
| Register | `/register` | Registration form |

### Protected Pages (requires authentication)
| Page | Route | Description |
|------|-------|-------------|
| Checkout | `/checkout/:id` | Order summary and payment |
| My Orders | `/orders/my` | Order history with tabs and actions |
| Edit Profile | `/profile/:username/edit` | Update personal info and password |
| Wishlist | `/wishlist` | Saved products |
| Become Seller | `/become-seller` | Upgrade to seller role |

### Seller Pages (requires seller role)
| Page | Route | Description |
|------|-------|-------------|
| My Products | `/dashboard` | Product listings with edit and delete |
| Incoming Orders | `/dashboard/orders` | Order management with confirm and cancel |
| New Product | `/dashboard/products/new` | Create a new product listing |
| Edit Product | `/dashboard/products/:id/edit` | Update product details and images |

## State Management

Authentication state is managed with Zustand and persisted in localStorage.

The auth store contains:
- `user` — Current user object with roles
- `token` — JWT token
- `setAuth(user, token)` — Set authenticated user
- `logout()` — Clear authentication state
- `isAuth()` — Check if user is authenticated
- `hasRole(role)` — Check if user has a specific role

## API Layer

All API calls go through a centralized Axios instance (`src/api/axios.ts`) that:

- Automatically attaches the JWT token to every request
- Handles 401 responses by logging out the user and showing a session expired toast
- Uses `VITE_API_URL` as the base URL

## Authentication

### Login Flow
1. User submits credentials
2. Token and user data are stored in Zustand store and localStorage
3. User is redirected to home page

### Session Management
- On app load, the stored token is used to fetch the current user from the API
- A timer is set based on the token expiry (`exp` field in JWT payload)
- When the token expires, the user is automatically logged out and a persistent toast is shown
- The toast disappears when the user logs in again

### Protected Routes
Routes that require authentication are wrapped in `ProtectedRoute` which redirects to `/login` if the user is not authenticated.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_BASE_URL` | Backend base URL for images | Yes |

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT
