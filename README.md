# Real Estate Booking API

## Overview

This project is a real estate booking system built with **Node.js, Express, Prisma ORM, and PostgreSQL**. The system allows users to **list properties, make offers, book properties, and manage transactions securely**. It also integrates **Supabase for image storage** and implements **security best practices**, including authentication, rate limiting, and logging and completely made in typescript.

## Technologies Used

- **Node.js** - Backend runtime
- **Express.js** - Web framework
- **TypeScript** - Typed JavaScript for robustness
- **Prisma** - ORM for PostgreSQL database
- **PostgreSQL** - Relational database
- **WS** - Real-time chat functionality
- **Supabase** - Cloud storage for images
- **jsonwebtoken (JWT)** - Authentication mechanism
- **argonv2** - Password hashing
- **helmet** - Security middleware
- **cors** - Cross-Origin Resource Sharing
- **compression** - Response compression
- **hpp** - HTTP parameter pollution prevention
- **express-rate-limit** - API rate limiting
- **winston** - Logging
- **express-fileupload** - File upload middleware

## Security Features

### 1. **Authentication & Authorization**

- JWT-based authentication with access & refresh tokens.
- Secure password hashing using argonv2.
- Secure session handling with `cookie-parser` and `express-session`.

### 2. **Rate Limiting**

- **General Rate Limiter:** Prevents abuse of API endpoints.
- **Auth Rate Limiter:** Limits login/signup attempts.

### 3. **Logging & Monitoring**

- Uses `winston` for structured logging.
- Logs all incoming requests and system events.

### 4. **Helmet & Other Security Middleware**

- **Helmet:** Provides security headers.
- **CORS:** Configured for secure API access.
- **HPP:** Prevents HTTP Parameter Pollution.
- **Compression:** Optimizes API performance.

## Database Schema

- **User**: Stores user details and authentication data.
- **Properties**: Stores property listings with an array of `transactions` and `offers`.
- **Transactions**: Handles booking transactions with status tracking (`PENDING`, `ACCEPTED`, `REJECTED`).
- **Chats & Messages**: Real-time messaging between users.

## Supabase Integration

- **Supabase Bucket** is used for storing property images.
- Users can upload images, and URLs are stored in the database.
- Images are retrieved securely via Supabase APIs.

## API Routes

### **Auth Routes** (`/api/v1/user/auth`)

- `POST /register` - Register a new user.
- `POST /login` - Authenticate user and return tokens.
- `POST /logout` - Logs out the user.
- `POST /refreshToken` - Refreshes the access token.

### **User Routes** (`/api/v1/user`)

- `GET /` - Fetch all Users.
- `GET /:id` - Fetch specific User.
- `PATCH /:id` - Update User profile details.
- `DELETE /:id` - Delete User.

### **Property Routes** (`/api/v1/properties`)

- `GET /` - List all properties.
- `POST /createProperty` - Create a new property listing.
- `GET /:id` - Fetch details of a specific property.
- `PATCH /:id` - Update property details.
- `DELETE /:id` - Delete a property.

### **Booking Routes** (`/api/v1/bookings`)

- `POST /` - Create a new booking (offer request).
- `GET /` - View user’s bookings.
- `GET /offers` - Fetch users offers.
- `PATCH /:id` - Accept or reject a booking offer.

### **Chat Routes** (`/api/v1/chat`)

- `GET /messages` - Fetch user messages.
- `POST /send` - Send a new message.

## Setup & Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/real-estate-booking.git
   cd real-estate-booking/server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):

   ```env
    NODE_ENV=ENTER_NODE_ENV
    BACKEND_VER=/api/API_VERSION
    PORT=ENTER_PORT_NUM

    DATABASE_URL="ENTER_SUPABASEDB_URL"
    SUPABASE_URL="ENTER_SUPABASE_CLIENT_URL"
    CORS_ORIGIN=ENTER_FRONTEND_URL

    SUPABASE_KEY=ENTER_SUPABASE_CLIENT_KEY
    SESSION_SECRET=ENTER_SECRET_KEY
    COOKIE_SECRET=ENTER_SECRET_KEY
    ACCESS_TOKEN_SECRET=ENTER_SECRET_KEY
    REFRESH_TOKEN_SECRET=ENTER_SECRET_KEY
   ```

4. Run database migrations:
   ```sh
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```sh
   npm run dev
   ```
6. Start the web socket server:
   ```sh
   npm run socket
   ```

## License

This project is open-source and available under the MIT License.
