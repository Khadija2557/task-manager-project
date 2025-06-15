# TaskFlow Backend API

A comprehensive Node.js/Express backend for the TaskFlow task management application with MongoDB integration.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with bcrypt password hashing
- **Task Management**: Full CRUD operations for tasks with filtering, sorting, and search
- **Category Management**: Organize tasks with custom categories
- **User Management**: User profiles and task sharing capabilities
- **Data Validation**: Comprehensive input validation with express-validator
- **Error Handling**: Centralized error handling with detailed error messages
- **Database**: MongoDB with Mongoose ODM
- **Security**: CORS, Helmet, and rate limiting
- **API Documentation**: RESTful API design

## 📁 Project Structure

\`\`\`
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── taskController.js     # Task management logic
│   ├── categoryController.js # Category management logic
│   └── userController.js     # User management logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── validation.js        # Input validation rules
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── User.js              # User schema
│   ├── Task.js              # Task schema
│   └── Category.js          # Category schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── tasks.js             # Task routes
│   ├── categories.js        # Category routes
│   └── users.js             # User routes
├── scripts/
│   └── seedData.js          # Database seeding script
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json             # Dependencies and scripts
\`\`\`

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Install Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Environment Setup
Create a `.env` file in the backend directory:

\`\`\`env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/taskflow

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=30d

# Server Configuration
NODE_ENV=development
PORT=5000
\`\`\`

### 3. Database Setup

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use the connection string: `mongodb://localhost:27017/taskflow`

**Option B: MongoDB Atlas (Cloud)**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### 4. Seed Database (Optional)
\`\`\`bash
npm run seed
\`\`\`

This creates a demo user and sample data:
- Email: `demo@taskflow.com`
- Password: `password123`

### 5. Start the Server
\`\`\`bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
\`\`\`

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks with filtering/sorting
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `GET /api/tasks/stats` - Get task statistics

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/:id` - Get single category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `GET /api/categories/stats` - Get category statistics

### Users
- `GET /api/users/search?q=query` - Search users for task sharing
- `GET /api/users/by-email/:email` - Get user by email

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## 📊 Query Parameters

### Tasks Filtering & Sorting
\`\`\`
GET /api/tasks?status=Completed&priority=High Priority&category=Work&search=meeting&sort=dueDate&order=asc&page=1&limit=10
\`\`\`

Parameters:
- `status`: All Status, Completed, Pending
- `priority`: All Priority, Low Priority, Medium Priority, High Priority, Urgent Priority
- `category`: Category name or "All Categories"
- `search`: Search in title and description
- `sort`: createdAt, dueDate, priority
- `order`: asc, desc
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

## 🧪 Testing

Test the API using tools like Postman, Insomnia, or curl:

\`\`\`bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
\`\`\`

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for all inputs
- **CORS**: Cross-origin resource sharing configured
- **Error Handling**: No sensitive data in error responses
- **Rate Limiting**: Prevent API abuse (can be added)

## 🚀 Deployment

### Environment Variables for Production
\`\`\`env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
PORT=5000
\`\`\`

### Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS deployment
- **AWS/GCP/Azure**: Cloud deployment

## 📝 Development Scripts

\`\`\`bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with sample data
npm test         # Run tests (when implemented)
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
