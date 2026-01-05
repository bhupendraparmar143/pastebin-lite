# Pastebin-Lite

A production-ready MERN stack Pastebin application that allows users to create and share text pastes with optional time-to-live (TTL) and view limits.

## 🚀 Features

- **Create Pastes**: Share text content with customizable expiration and view limits
- **Time-to-Live (TTL)**: Set expiration time for pastes (in seconds)
- **View Limits**: Restrict number of times a paste can be viewed
- **Secure Sharing**: Generate shareable URLs for created pastes
- **Responsive UI**: Clean, minimal interface that works on all devices
- **API-First**: RESTful API with proper error handling
- **Test-Friendly**: Built-in test mode for automated testing
- **Production-Ready**: Security headers, rate limiting, and proper error handling

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React.js with Vite, React Router DOM, Axios
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Database**: MongoDB Atlas (persistent cloud storage)
- **Deployment**: Vercel (frontend), Render/Railway (backend)

### Project Structure
```
pastebin-lite/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

## 🗄️ Database Schema

### Paste Model
```javascript
{
  content: String (required, non-empty),
  createdAt: Date,
  expiresAt: Date | null,
  maxViews: Number | null,
  views: Number (default: 0)
}
```

## 🔌 API Endpoints

### Health Check
```
GET /api/healthz
```
- Returns: `{ "ok": true }`
- Confirms database connectivity

### Create Paste
```
POST /api/pastes
```
**Request Body:**
```json
{
  "content": "string",
  "ttl_seconds": 60,     // optional
  "max_views": 5         // optional
}
```

**Response:**
```json
{
  "id": "pasteId",
  "url": "https://your-domain/p/pasteId"
}
```

### Get Paste (API)
```
GET /api/pastes/:id
```
**Response:**
```json
{
  "content": "string",
  "remaining_views": number | null,
  "expires_at": "ISO string" | null
}
```

### View Paste (HTML)
```
GET /p/:id
```
- Returns HTML page with paste content
- Content is safely rendered (HTML escaped)

## 🕒 TTL & View Logic

Pastes become unavailable when:
- **TTL expires** OR
- **Max views exceeded**

The first condition to trigger makes the paste unavailable.

## 🧪 Test Mode

When `TEST_MODE=1` is set:
- Backend reads current time from `x-test-now-ms` header
- Falls back to system time if header missing
- Enables deterministic testing of time-based features

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Local Development

1. **Clone and setup:**
   ```bash
   cd pastebin-lite
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Copy .env and configure MongoDB URI
   cp .env.example .env
   # Edit .env with your MongoDB Atlas connection string
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
TEST_MODE=0
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_TEST_MODE=0
```

## 🚢 Deployment

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Deploy

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables for production API URL
4. Deploy

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Configured for allowed origins
- **Rate Limiting**: API request throttling
- **Input Validation**: Content and parameter validation
- **HTML Escaping**: XSS prevention in HTML views
- **No Secrets**: Environment variables for sensitive data

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Test Mode Setup
```bash
# Enable test mode
export TEST_MODE=1

# Set custom time for testing (example)
curl -H "x-test-now-ms: 1640995200000" http://localhost:5000/api/pastes
```

## 🎯 Key Design Decisions

### Persistence Layer
- **MongoDB Atlas**: Chosen for scalability and reliability
- **Mongoose ODM**: Schema validation and type safety
- **Indexes**: Optimized queries for expiration and creation time
- **Atomic Operations**: View counting with `$inc` for consistency

### API Design
- **RESTful**: Standard HTTP methods and status codes
- **JSON-only**: Consistent API responses
- **Error Handling**: Structured error responses
- **Validation**: Input sanitization and type checking

### Frontend Architecture
- **React Router**: Client-side routing for SPA experience
- **Axios**: HTTP client with interceptors for test mode
- **Component-based**: Reusable UI components
- **Responsive Design**: Mobile-first approach

### Production Considerations
- **Environment-based Config**: Different settings for dev/prod
- **Process Management**: Proper error handling and graceful shutdown
- **Security Headers**: Protection against common web vulnerabilities
- **Rate Limiting**: Protection against abuse

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project for learning and production purposes.

---

**Built with ❤️ using the MERN stack**
