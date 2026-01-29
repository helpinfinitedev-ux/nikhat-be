# E-Commerce API Server

A RESTful API server built with Express.js and MongoDB for managing an e-commerce application.

## Features

- User management
- Product catalog
- Customer ratings and reviews
- Payment processing
- Image upload service using Multer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customer Ratings
- `POST /api/ratings` - Create a new rating
- `GET /api/ratings` - Get all ratings
- `GET /api/ratings/:id` - Get rating by ID
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating

### Payments
- `POST /api/payments` - Create a new payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/user/:userId` - Get payments by user ID
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### File Upload
- `POST /api/upload/single` - Upload a single image
- `POST /api/upload/multiple` - Upload multiple images (max 10)

## Data Models

### User
```javascript
{
  name: String,
  emailAddress: String,
  phoneNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  lastPurchase: Date,
  purchaseQuantity: Number,
  role: String (customer/admin)
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  offer: Number,
  boughtQuantity: Number,
  imageUrls: [String]
}
```

### CustomerRating
```javascript
{
  customerName: String,
  rating: Number (1-5),
  description: String,
  date: Date
}
```

### Payment
```javascript
{
  userId: ObjectId,
  productId: ObjectId,
  price: Number,
  mode: String (card/upi/netbanking/wallet/cod),
  razorpayId: String,
  status: String (pending/completed/failed/refunded)
}
```

## File Upload

The API supports image uploads with the following specifications:
- Accepted formats: JPEG, JPG, PNG, GIF, WEBP
- Maximum file size: 5MB
- Files are stored in the `uploads/` directory
- Uploaded files are accessible via `/uploads/<filename>`

## Error Handling

All endpoints return JSON responses with the following structure:

Success:
```javascript
{
  success: true,
  data: {...}
}
```

Error:
```javascript
{
  success: false,
  error: "Error message"
}
```

## Project Structure

```
├── config/
│   └── database.js         # MongoDB connection
├── middleware/
│   └── upload.js           # Multer configuration
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── CustomerRating.js
│   └── Payment.js
├── routes/
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── ratingRoutes.js
│   ├── paymentRoutes.js
│   └── uploadRoutes.js
├── uploads/                # Uploaded files directory
├── server.js               # Main application file
└── package.json
```
