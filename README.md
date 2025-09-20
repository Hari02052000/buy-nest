# Buy Nest  - E-commerce Application

## Overview

Buy Nest is a comprehensive e-commerce application backend built with Node.js, Express, TypeScript, and MongoDB. It follows Clean Architecture principles with clear separation of concerns across Domain, Application, Infrastructure, and Presentation layers.
Frontend built with React with saparate admin dashboard and user section with lazy loading admin state fully managed with context api and user side with redux toolkit

# Backend

## Clean Architecture

The backend architecture:

- **Domain Layer**: Contains business entities, interfaces, and types
- **Application Layer**: Contains business logic and services
- **Infrastructure Layer**: Contains external concerns (database, utilities, configurations)
- **Presentation Layer**: Contains controllers, routes, and middleware

## Core Features

- User Authentication (Regular & Google OAuth)
- Admin Management
- Product Management
- Category Management
- Shopping Cart
- Wishlist
- Image Upload (Cloudinary)
- JWT Token Management
---
## API Endpoints Structure

### Authentication Routes (`/api/v1/auth`)

- `POST /login` - User login
- `POST /register` - User registration
- `POST /refresh` - Token refresh
- `POST /admin/login` - Admin login
- `POST /admin/refresh` - Admin token refresh
- `GET /google` - Google OAuth login
- `GET /google/callback` - Google OAuth callback

### Product Routes (`/api/v1/product`)

- `GET /` - Get all products (paginated)
- `GET /:id` - Get single product
- `POST /` - Create product (Admin)
- `PUT /:id` - Update product (Admin)
- `POST /:id/images` - Upload product images (Admin)
- `DELETE /:id/images` - Delete product image (Admin)

### Category Routes (`/api/v1/category`)

- `GET /` - Get all categories (paginated)
- `GET /:id` - Get single category
- `GET /:id/subcategories` - Get subcategories
- `POST /` - Create category (Admin)
- `PUT /:id` - Update category (Admin)
- `POST /:id/image` - Upload category image (Admin)
- `PUT /:id/list` - Change listing status (Admin)

### Cart Routes (`/api/v1/cart`)

- `GET /` - Get user cart
- `POST /add` - Add item to cart
- `PUT /update` - Update cart item
- `DELETE /remove/:productId` - Remove item from cart
- `DELETE /clear` - Clear entire cart

### Wishlist Routes (`/api/v1/wishlist`)

- `GET /` - Get user wishlist
- `POST /add` - Add item to wishlist
- `DELETE /remove/:productId` - Remove item from wishlist
- `DELETE /clear` - Clear entire wishlist

---

## Security Features

### Authentication & Authorization

- JWT-based authentication with access/refresh token pattern
- HTTP-only cookies for token storage
- Admin-specific token validation
- Google OAuth integration
- Password hashing with bcrypt and salt

### Data Validation

- Joi schema validation for all inputs
- File upload validation
- Unique constraint validation
- Authorization checks for admin operations

---

## Environment Configuration

The application uses environment variables for configuration:

- `PORT` - Server port (default: 3000)
- `APP_SECRET` - JWT signing secret
- `DB_URL` - Database connection string
- `cloudinary_cloud_name` - cloudinary credantials for image upload
- `cloudinary_api_key` - cloudinary credantials for image upload
- `cloudinary_api_secret` - cloudinary credantials for image upload
- `google_client_id` - google credantials for google login
- `google_client_secret` - google credantials for google login
- `google_callback_url` - google credantials for google login
- `google_callback_url` - google credantials for google login
- `STRIPE_PUBLISHABLE_KEY` - stripe credantials for online payment
- `STRIPE_SECRET_KEY` - stripe credantials for online payment
- `frontend_url` -  frontend url for communication
---

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm test` - Run test suite
- `npm run format` - Format code with Prettier

---

## Error Handling

The application implements comprehensive error handling:

### Custom Error Types

- **ValidationError**: Input validation failures
- **AuthorizeError**: Authentication/authorization failures
- **NotFoundError**: Resource not found errors

### Error Middleware

- Centralized error processing
- Appropriate HTTP status codes
- Sanitized error messages
- Development vs production error details

---

## File Upload System

### Image Upload Features

- Cloudinary integration for cloud storage
- Multiple file upload support
- Image optimization and transformation
- Secure file validation
- Automatic cleanup on deletion

### Supported Operations

- Product image galleries
- Category thumbnails
- User profile pictures
- Bulk image operations
---
# Frontend


This README provides a comprehensive overview of all functions and their purposes within the Buy Nest Backend application. Each function is documented with its purpose, parameters, validation logic, and return values to help developers understand and maintain the codebase effectively.
