
# TODO: Full-Stack Application with PostgreSQL Backend

This document outlines the necessary steps to transform the current frontend-only React application (Review Fighters App) into a full-stack application with a persistent PostgreSQL backend (e.g., on Railway) and proper "middleware" (backend logic).

## I. Backend Development (The "Middleware")

This is a new, separate application that will handle business logic, database interactions, and secure API calls.

### 1. Choose Backend Technology Stack
   - **Language/Framework:**
     - Node.js with Express.js, NestJS, or Fastify
     - Python with Django or Flask
     - Ruby on Rails
     - Java with Spring Boot
     - Go with Gin
   - **Database ORM/Client:**
     - **Node.js:** Prisma (recommended for type safety), TypeORM, Sequelize, or `pg` (node-postgres) client.
     - Choose based on team familiarity and project needs.

### 2. Project Setup
   - Initialize a new backend project directory.
   - Install necessary dependencies (framework, ORM/DB client, `dotenv` for environment variables, JWT library, etc.).

### 3. Database Connection (to Railway PostgreSQL)
   - **Environment Variables:** Store your Railway PostgreSQL connection string (e.g., `DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/YOUR_DATABASE_NAME"`) in an environment variable (e.g., `.env` file for local development, Railway's environment variable settings for deployment).
   - **DO NOT hardcode credentials in your backend code.**
   - Your backend application will use this `DATABASE_URL` to connect.

### 4. Database Schema Design & ORM Setup
   - **Translate `types.ts` to Tables:**
     - Each interface in `frontend/src/types.ts` (e.g., `User`, `UserProfile`, `Review`, `Affiliate`, `Task`, `SystemSetting`) will generally map to a database table.
     - Define columns with appropriate SQL data types (e.g., `VARCHAR`, `TEXT`, `INTEGER`, `NUMERIC`, `BOOLEAN`, `TIMESTAMPTZ`, `UUID`, `JSONB` for arrays/objects).
     - Establish relationships (one-to-one, one-to-many, many-to-many) using foreign keys.
   - **ORM Configuration:**
     - If using an ORM, define models/entities that map to your tables.
     - Configure the ORM to connect to your PostgreSQL database.
   - **Database Migrations:**
     - Use a migration tool (often built into ORMs like Prisma, TypeORM, or standalone tools like Flyway, Liquibase) to create and manage your database schema versions. This is crucial for evolving your schema.
     - Write initial migration scripts to create all tables based on your design.

### 5. API Endpoint Implementation
   - **Replicate Mock Services:** For each service file in `frontend/src/services/` (e.g., `authService.ts`, `profileService.ts`), create corresponding RESTful API endpoints in your backend.
     - **Example `authService.ts` -> Backend Auth API:**
       - `POST /api/auth/signup`
       - `POST /api/auth/login`
       - `POST /api/auth/logout`
       - `GET /api/auth/me` (to get current user from token)
     - **Example `profileService.ts` -> Backend Profile API:**
       - `GET /api/profiles/:userId`
       - `PUT /api/profiles/:userId`
       - `GET /api/profiles/:userId/subscription`
       - `GET /api/profiles/:userId/stripe-portal`
     - **Example `reviewService.ts` -> Backend Review API:**
       - `GET /api/reviews` (possibly with query params for filtering by user)
       - `POST /api/reviews`
       - `PUT /api/reviews/:reviewId`
       - `DELETE /api/reviews/:reviewId`
     - **Example `mediaService.ts` -> Backend Media API:**
       - `GET /api/media`
       - `POST /api/media/upload` (handle file uploads, store files on a service like AWS S3, Google Cloud Storage, or Railway Volumes, and save metadata to DB).
       - `DELETE /api/media/:mediaId`
       - `GET /api/reviews/:reviewId/media`
     - ... and so on for `affiliateService`, `marketingService`, `staffService`, `ownerService`, `notificationService`.

### 6. Business Logic Implementation
   - Within each API endpoint, implement the necessary business logic:
     - Data validation for incoming requests.
     - Data processing.
     - Interactions with the PostgreSQL database (CRUD operations via ORM or SQL queries).

### 7. Authentication & Authorization
   - **User Registration:**
     - Securely hash passwords (e.g., using bcrypt) before storing them in the `users` table.
   - **User Login:**
     - Compare provided password with the stored hash.
     - Generate a JWT (JSON Web Token) or session token upon successful login.
   - **Token Management:**
     - Send the JWT back to the frontend. The frontend will store it and send it in the `Authorization` header for subsequent authenticated requests.
   - **Protect Endpoints:**
     - Implement middleware to verify JWTs on protected API routes.
   - **Role-Based Access Control (RBAC):**
     - Check user roles (from JWT payload or database) to authorize access to specific endpoints or actions, mirroring the frontend's `RoleProtectedRoute` logic but on the server-side.

### 8. Gemini API Integration (Backend Proxy)
   - **API Key Security:** The Gemini API key (`process.env.API_KEY`) **MUST** be stored and used exclusively on the backend. Never expose it to the frontend.
   - **Proxy Endpoints:** Create backend API endpoints that your frontend will call for AI interactions.
     - Example: `POST /api/ai/chat/send-message`, `POST /api/ai/generate-text`.
   - **Backend Logic:** These backend endpoints will then make the actual calls to the Gemini API using the `@google/genai` SDK (configured with the API key from backend environment variables).
   - This pattern protects your API key and allows for additional server-side logic if needed (e.g., logging, rate limiting, pre-processing).

### 9. Error Handling
   - Implement robust error handling middleware.
   - Return consistent and meaningful error responses (e.g., JSON with error messages and appropriate HTTP status codes).

### 10. Input Validation
    - Use a library (e.g., Joi, Zod, express-validator) to validate all data received from the frontend to prevent invalid data and potential security issues.

## II. PostgreSQL Database Setup (on Railway)

### 1. Schema Creation
   - Once your backend is connected to Railway and migrations are set up, run the initial migration to create all tables, columns, relationships, and indexes in your PostgreSQL database.

### 2. Initial Data (Optional)
   - Seed the database with any necessary initial data:
     - Default system settings.
     - An initial owner/admin user account.

### 3. Security (Recap)
   - Your Railway instance is already password-protected by the credentials you have.
   - Ensure network settings on Railway restrict access to your database if possible (e.g., only allow connections from your deployed backend service if they are in the same private network).

## III. Frontend Application Updates

### 1. Configure API Base URL
   - Use an environment variable in your React app (e.g., `REACT_APP_API_BASE_URL` if using Create React App, or `VITE_API_BASE_URL` if using Vite) to store the URL of your deployed backend (e.g., `https://your-backend.railway.app/api`).
   - Default to `http://localhost:PORT/api` for local development.

### 2. Update Service Files (`frontend/src/services/`)
   - **Replace Mock Calls:** Modify every function in each service file.
     - Instead of returning mock data or using `localStorage`, use `fetch` or a library like `axios` to make HTTP requests to your new backend API endpoints.
     - Example `authService.login(email, pass)`:
       ```javascript
       // Before: const user = mockUsers.find(...); return user;
       // After:
       const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, pass }),
       });
       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || 'Login failed');
       }
       const { user, token } = await response.json(); // Backend should return user and token
       localStorage.setItem('authToken', token); // Store token
       return user;
       ```
   - **Handle API Responses:** Properly handle success and error responses from the backend.
   - **Update `geminiService.ts`:**
     - All functions in `geminiService.ts` should now call your backend proxy endpoints (e.g., `/api/ai/chat/send-message`) instead of using the `@google/genai` SDK directly in the frontend.
     - Remove the direct import of `@google/genai` from `geminiService.ts` if all calls are proxied. The frontend should no longer attempt to initialize `GoogleGenAI`.

### 3. Authentication Flow Updates
   - **`useAuth.ts`:**
     - Modify `login` to call the backend, store the JWT, and set the user state.
     - Modify `logout` to call a backend logout endpoint (if any, to invalidate server-side session/token if applicable) and clear the local token and user state.
     - Modify `getCurrentUser` to verify the local token with a backend endpoint (e.g., `/api/auth/me`) or by decoding the JWT (if it contains necessary user info and is not expired, though server-side validation is more secure).
   - **Authenticated Requests:** For all API calls requiring authentication, include the JWT in the `Authorization` header (e.g., `Authorization: Bearer YOUR_JWT_TOKEN`).

### 4. Phase Out Mock Data and `localStorage` for Data Persistence
   - Remove `frontend/src/data/mockData.ts` and its usage. All data should come from the backend.
   - For features like the Landing Page Editor:
     - Current: Saves to `localStorage`.
     - **New Backend Approach:**
       - Backend: Create API endpoints (e.g., `GET /api/landing-content`, `PUT /api/landing-content`) to fetch/store landing page content in the database.
       - Frontend: Update `OwnerLandingPageEditorPage.tsx` to call these backend APIs. Update `LandingPage.tsx` to fetch its content from the `GET /api/landing-content` endpoint.

## IV. Deployment

### 1. Backend Deployment
   - Deploy your backend application to a cloud platform (Railway is a good choice if your DB is there, Heroku, AWS, Google Cloud, Azure, etc.).
   - **Configure Environment Variables on Server:**
     - `DATABASE_URL` (for PostgreSQL connection)
     - `GEMINI_API_KEY`
     - `JWT_SECRET` (a strong, random secret for signing JWTs)
     - `PORT`
     - `NODE_ENV=production`
     - Any other API keys or configurations.

### 2. Frontend Deployment
   - Deploy your React application to a static hosting service (Vercel, Netlify, GitHub Pages, Railway, etc.).
   - **Configure Environment Variables on Frontend Host:**
     - `REACT_APP_API_BASE_URL` (or `VITE_API_BASE_URL`) pointing to your *deployed* backend API URL.

### 3. CORS (Cross-Origin Resource Sharing)
   - Configure your backend to allow requests from your deployed frontend's domain. Use a CORS middleware (e.g., `cors` package for Express).

## V. Key Security Considerations

- **HTTPS:** Ensure all communication between frontend, backend, and database (if over public internet, though Railway internal network is better) uses HTTPS/SSL.
- **Secrets Management:** Never commit API keys, database credentials, or JWT secrets to your Git repository. Use environment variables.
- **Input Validation:** Implement thorough input validation on both the frontend (for UX) and, critically, on the backend (for security).
- **Password Hashing:** Use strong hashing algorithms (e.g., bcrypt, Argon2) for passwords.
- **SQL Injection Prevention:** Use an ORM or parameterized queries to prevent SQL injection.
- **XSS (Cross-Site Scripting) Prevention:** Sanitize user-generated content before rendering it on the frontend. Frameworks like React help, but be cautious with `dangerouslySetInnerHTML`.
- **CSRF (Cross-Site Request Forgery) Protection:** Implement CSRF tokens if using session-based authentication (JWTs in headers are generally less susceptible if implemented correctly).
- **Dependency Updates:** Regularly update all dependencies (frontend and backend) to patch security vulnerabilities.

## VI. Making the Landing Page Editor "Real"

- **Current:** Content is loaded from `data/landingPageContent.ts` or `localStorage`. Editor saves to `localStorage`.
- **Full-Stack Approach:**
  1.  **Backend:**
      - Create a new table in your PostgreSQL database (e.g., `landing_page_configurations`) to store the JSON structure of the landing page content.
      - Create API endpoints:
        - `GET /api/content/landing`: Fetches the landing page content from the database.
        - `PUT /api/content/landing`: Allows authenticated admins/owners to update the landing page content in the database.
  2.  **Frontend:**
      - Modify `pages/LandingPage.tsx`:
        - Fetch its initial content from the `GET /api/content/landing` backend endpoint instead of `data/landingPageContent.ts` or `localStorage`.
      - Modify `pages/owner/OwnerLandingPageEditorPage.tsx`:
        - Load initial content for editing from `GET /api/content/landing`.
        - When "Save Changes" is clicked, send the updated `editableContent` to the `PUT /api/content/landing` backend endpoint.
        - The "Reset to Defaults" button could either:
          - Send the original `defaultContent` object from the frontend to the `PUT` endpoint.
          - Or, have a dedicated backend endpoint `POST /api/content/landing/reset` that resets the DB record to a predefined default.

## Conclusion

This transformation is a significant undertaking, essentially building a new backend application and refactoring the frontend to communicate with it. Each step requires careful planning and implementation. This list provides a roadmap. Good luck!
