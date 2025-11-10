# E-Marketplace

Full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for an online marketplace.

## Features

- **User Roles**: Buyer and Seller with separate dashboards
- **Authentication**: JWT-based registration and login with bcrypt password hashing
- **Buyer Features**: Browse products, search & filter, view details, add to cart, place orders, view order history
- **Seller Features**: Add/edit/delete products with image upload, view received orders
- **Responsive UI**: Built with React and Bootstrap CDN

## Tech Stack

**Backend**:
- Node.js + Express
- MongoDB (Mongoose)
- JWT (jsonwebtoken) + bcrypt
- Multer (for image uploads)

**Frontend**:
- React 18 + Vite
- React Router DOM
- Context API for auth state
- Axios for API calls
- Bootstrap 5 (via CDN)

## Prerequisites

- **Node.js** (v16+ recommended)
- **MongoDB**: Remote database already configured
  - Connection details are pre-configured in `backend/.env`

## Getting Started

### 1. Clone/Download the Project

```bash
cd FS_PROJECT
```

### 2. Setup Backend

```bash
cd backend
npm install
```

- **Database is already configured**: The `.env` file contains the remote MongoDB connection details.
- **Start the backend**:

```bash
npm start
```

Backend will run on `http://localhost:5000`.

For development with auto-reload:

```bash
npm run dev
```

### 3. Setup Frontend

Open a **new terminal**, then:

```bash
cd frontend
npm install
```

- **Start the frontend**:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (default Vite port).

### 4. Use the Application

1. Open `http://localhost:5173` in your browser.
2. **Register** as a **Buyer** or **Seller**.
3. **Buyer**: Browse products, search/filter, view details, add to cart, place orders, view order history.
4. **Seller**: Add/edit/delete products with image uploads, view orders received for your products.

## Project Structure

```
FS_PROJECT/
├── backend/
│   ├── controllers/       # Auth, Product, Order controllers
│   ├── models/            # Mongoose models (User, Product, Order)
│   ├── routes/            # Express routes
│   ├── middleware/        # authMiddleware for JWT
│   ├── uploads/           # Multer image storage
│   ├── server.js          # Entry point
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/         # React page components
    │   ├── App.jsx        # Main App with routing
    │   ├── AuthContext.jsx  # Auth context provider
    │   └── main.jsx       # React entry
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## API Endpoints

**Auth**:
- `POST /api/auth/register` - Register user (buyer or seller)
- `POST /api/auth/login` - Login

**Products**:
- `GET /api/products` - Get all products (query params: `q`, `category`)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` (protected) - Create product (seller)
- `PUT /api/products/:id` (protected) - Update product (seller)
- `DELETE /api/products/:id` (protected) - Delete product (seller)
- `GET /api/products/seller` (protected) - Get seller's own products

**Orders**:
- `POST /api/orders` (protected) - Create order (buyer)
- `GET /api/orders/my` (protected) - Get buyer's orders
- `GET /api/orders/seller` (protected) - Get seller's orders

## Notes

- **Image Upload**: Product images are stored in `backend/uploads/` and served statically at `/uploads`.
- **Cart**: Stored in browser localStorage (simple implementation).
- **Validation**: Basic form validation on frontend for login/register/product forms.
- **Security**: Passwords are hashed with bcrypt. JWT tokens stored in localStorage.

## Future Enhancements

- Payment integration
- Order status updates
- Admin panel
- Product reviews/ratings
- Email notifications

---

**Enjoy building your E-Marketplace!**
