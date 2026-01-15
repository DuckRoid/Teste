# ChatApp - Real-Time Communication Application 🚀

A modern, full-stack real-time communication platform similar to Discord, built with React, TypeScript, Node.js, and Socket.io. Features include instant messaging, voice/video calls, and a unique, beautiful UI design.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

## ✨ Features

### Core Functionality
- ✅ **Real-time messaging** with WebSocket (Socket.io)
- ✅ **Voice & Video calls** with WebRTC
- ✅ **Server/Community system** with channels
- ✅ **User authentication** with JWT
- ✅ **Typing indicators** for active users
- ✅ **Online/Offline status** tracking
- ✅ **Message history** with pagination
- ✅ **Emoji support** with picker
- ✅ **Responsive design** for mobile, tablet, and desktop

### Unique Design
- 🎨 Custom color palette (Purple, Turquoise, Pink)
- 🌙 Dark theme with glassmorphism effects
- ✨ Smooth animations and transitions
- 🎯 Modern, intuitive UI/UX
- 📱 Mobile-first responsive design

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for blazing fast development
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Socket.io-client** for real-time communication
- **Simple-peer** for WebRTC connections
- **React Router** for navigation
- **Emoji Picker React** for emoji support
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **Socket.io** for WebSocket communication
- **MongoDB** with **Mongoose** ORM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **Express Validator** for input validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v7.0 or higher)
- **Git**

Alternatively, you can use **Docker** and **Docker Compose** to run the entire stack.

## 🚀 Quick Start

### Option 1: Local Development

#### 1. Clone the repository
```bash
git clone https://github.com/DuckRoid/Teste.git
cd Teste
```

#### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
npm run dev
```

#### 3. Setup Frontend (in a new terminal)
```bash
cd client
npm install
cp .env.example .env
# Edit .env with your API URLs if needed
npm run dev
```

#### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Option 2: Docker Compose

#### 1. Clone and configure
```bash
git clone https://github.com/DuckRoid/Teste.git
cd Teste
```

#### 2. Create environment file
```bash
echo "JWT_SECRET=your_super_secret_key_here" > .env
```

#### 3. Start all services
```bash
docker-compose up -d
```

#### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## 📁 Project Structure

```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Auth/      # Login, Register, ProtectedRoute
│   │   │   ├── Chat/      # ChatWindow, MessageList, MessageInput
│   │   │   ├── Sidebar/   # ServerList, ChannelList
│   │   │   └── VoiceCall/ # Voice/Video call components
│   │   ├── pages/         # Main pages (Home)
│   │   ├── services/      # API and Socket.io services
│   │   ├── store/         # Zustand state management
│   │   ├── styles/        # Global CSS styles
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth and other middleware
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── socket/       # Socket.io event handlers
│   │   └── index.ts      # Server entry point
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml    # Docker orchestration
└── README.md
```

## 🔑 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/status` - Update user status

### Servers
- `POST /api/servers` - Create server
- `GET /api/servers` - Get user's servers
- `GET /api/servers/:serverId` - Get server details
- `POST /api/servers/:serverId/join` - Join server
- `POST /api/servers/:serverId/leave` - Leave server

### Channels
- `POST /api/channels` - Create channel
- `GET /api/channels/server/:serverId` - Get server channels
- `GET /api/channels/:channelId` - Get channel details
- `DELETE /api/channels/:channelId` - Delete channel

### Messages
- `GET /api/messages/channel/:channelId` - Get channel messages
- `POST /api/messages` - Send message
- `PATCH /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

## 🔌 Socket.io Events

### Messaging
- `message:send` - Send a message
- `message:receive` - Receive a message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

### User Status
- `user:online` - User came online
- `user:offline` - User went offline

### WebRTC Signaling
- `call:offer` - Initiate call
- `call:answer` - Answer call
- `call:ice-candidate` - Exchange ICE candidates
- `call:end` - End call

### Channel
- `channel:join` - Join a channel
- `channel:leave` - Leave a channel

## 🎨 Color Palette

The application uses a unique and modern color scheme:

- **Primary**: `#6C5CE7` (Vibrant Purple)
- **Secondary**: `#00B894` (Turquoise Green)
- **Accent**: `#FD79A8` (Soft Pink)
- **Background Dark**: `#1A1A2E`
- **Background Light**: `#16213E`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A8A8A8`

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

## 🔒 Security Features

- ✅ JWT authentication with secure tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting to prevent abuse
- ✅ Input validation and sanitization
- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ XSS protection

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy using Git or Docker

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the production version: `npm run build`
2. Set environment variables
3. Deploy the `dist` folder

### Full Stack Deployment
Use the provided `docker-compose.yml` for easy deployment on any VPS or cloud platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**DuckRoid**
- GitHub: [@DuckRoid](https://github.com/DuckRoid)

## 🙏 Acknowledgments

- Socket.io for real-time communication
- Simple-peer for WebRTC implementation
- Tailwind CSS for beautiful styling
- The React and Node.js communities

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Node.js**