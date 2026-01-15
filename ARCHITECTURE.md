# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React UI   │  │    Zustand   │  │ React Router │          │
│  │  Components  │  │  State Mgmt  │  │  Navigation  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
│         │                 │                                       │
│  ┌──────▼─────────────────▼───────┐  ┌──────────────┐          │
│  │     Services Layer             │  │   WebRTC     │          │
│  │  ┌──────┐    ┌──────────────┐ │  │ Simple Peer  │          │
│  │  │ Axios│    │ Socket.io    │ │  └──────────────┘          │
│  │  │ HTTP │    │  WebSocket   │ │                             │
│  │  └───┬──┘    └──────┬───────┘ │                             │
│  └──────┼───────────────┼─────────┘                             │
│         │               │                                        │
└─────────┼───────────────┼────────────────────────────────────────┘
          │               │
          │               │  WebSocket Connection
          │               │
┌─────────▼───────────────▼────────────────────────────────────────┐
│                       NETWORK LAYER                               │
│                                                                   │
│         HTTP/HTTPS              WebSocket/WSS                    │
│                                                                   │
└─────────┬───────────────┬────────────────────────────────────────┘
          │               │
          │               │
┌─────────▼───────────────▼────────────────────────────────────────┐
│                      SERVER (Node.js)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐           ┌──────────────────┐            │
│  │  Express.js      │           │   Socket.io      │            │
│  │  REST API        │           │   Real-time      │            │
│  └────────┬─────────┘           └────────┬─────────┘            │
│           │                              │                       │
│  ┌────────▼──────────────────────────────▼─────────┐            │
│  │            Middleware Layer                      │            │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌────────────────┐ │            │
│  │  │ Auth │ │ CORS │ │ Rate │ │   Validation   │ │            │
│  │  │ JWT  │ │      │ │Limit │ │                │ │            │
│  │  └──────┘ └──────┘ └──────┘ └────────────────┘ │            │
│  └────────┬──────────────────────────────┬─────────┘            │
│           │                              │                       │
│  ┌────────▼─────────┐         ┌─────────▼────────┐             │
│  │   Controllers    │         │  Socket Handlers │             │
│  │                  │         │                  │             │
│  │ • Auth           │         │ • Messages       │             │
│  │ • Servers        │         │ • Typing         │             │
│  │ • Channels       │         │ • Presence       │             │
│  │ • Messages       │         │ • WebRTC Signal  │             │
│  └────────┬─────────┘         └──────────────────┘             │
│           │                                                      │
│  ┌────────▼─────────┐                                           │
│  │  Mongoose ODM    │                                           │
│  └────────┬─────────┘                                           │
│           │                                                      │
└───────────┼──────────────────────────────────────────────────────┘
            │
            │
┌───────────▼──────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Users   │  │ Servers  │  │ Channels │  │ Messages │        │
│  │          │  │          │  │          │  │          │        │
│  │ • email  │  │ • name   │  │ • name   │  │ • content│        │
│  │ • pass   │  │ • owner  │  │ • type   │  │ • author │        │
│  │ • avatar │  │ • members│  │ • server │  │ • channel│        │
│  │ • status │  │ • channels│ │          │  │ • time   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
1. User → Register/Login Form
2. Client → POST /api/auth/register or /api/auth/login
3. Server → Validate credentials
4. Server → Hash password (bcrypt)
5. Server → Generate JWT token
6. Server → Return token + user data
7. Client → Store token in localStorage
8. Client → Connect to Socket.io with token
9. Socket.io → Verify JWT
10. Socket.io → Mark user online
```

### Messaging Flow
```
1. User types message → MessageInput component
2. User sends → socket.emit('message:send')
3. Server receives → Validate user & channel
4. Server → Save to MongoDB
5. Server → Populate author data
6. Server → socket.to(channel).emit('message:receive')
7. All clients in channel → Receive message
8. Clients → Update UI (add to message list)
```

### Voice/Video Call Flow
```
1. User A → Joins voice channel
2. Client A → Get media stream (WebRTC)
3. Client A → Create peer connection
4. Client A → socket.emit('call:offer')
5. Server → Forward to User B
6. User B → socket.on('call:offer')
7. Client B → Create peer connection
8. Client B → socket.emit('call:answer')
9. Server → Forward to User A
10. Both clients → Exchange ICE candidates
11. Both clients → Establish P2P connection
12. Audio/Video streams directly between peers
```

## Technology Stack

### Frontend Stack
```
React 18.2          → UI Framework
TypeScript 5.3      → Type Safety
Vite 5.0           → Build Tool
Tailwind CSS 3.4   → Styling
Zustand 4.4        → State Management
Socket.io-client   → WebSocket
Simple-peer        → WebRTC
React Router 6     → Navigation
Axios              → HTTP Client
Emoji Picker React → Emoji Support
Lucide React       → Icons
```

### Backend Stack
```
Node.js 20         → Runtime
Express 4.18       → Web Framework
TypeScript 5.3     → Type Safety
Socket.io 4.6      → WebSocket
MongoDB 8.0        → Database
Mongoose           → ODM
JWT                → Authentication
Bcrypt             → Password Hashing
Helmet             → Security Headers
Express Rate Limit → Rate Limiting
Express Validator  → Input Validation
CORS               → Cross-Origin
```

## Security Measures

```
┌─────────────────────────────────────────┐
│          Security Layers                │
├─────────────────────────────────────────┤
│                                         │
│  1. HTTPS/WSS (Production)             │
│     └─ Encrypted communication          │
│                                         │
│  2. CORS Protection                     │
│     └─ Whitelist trusted origins        │
│                                         │
│  3. Rate Limiting                       │
│     └─ Prevent API abuse                │
│                                         │
│  4. Helmet.js                           │
│     └─ Security headers                 │
│                                         │
│  5. JWT Authentication                  │
│     └─ Stateless auth tokens            │
│                                         │
│  6. Input Validation                    │
│     └─ Sanitize all inputs              │
│                                         │
│  7. Password Hashing                    │
│     └─ Bcrypt with salt                 │
│                                         │
│  8. MongoDB Injection Prevention        │
│     └─ Mongoose query sanitization      │
│                                         │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Production Setup                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌────────────┐      ┌────────────┐                 │
│  │   Vercel   │      │  Railway   │                 │
│  │  (Client)  │      │  (Server)  │                 │
│  └─────┬──────┘      └─────┬──────┘                 │
│        │                   │                         │
│        │                   ├─────► MongoDB Atlas     │
│        │                   │                         │
│        └───────────────────┘                         │
│                                                       │
│  Alternative:                                        │
│  ┌────────────────────────────────┐                 │
│  │       Docker Compose           │                 │
│  │  ┌─────────┐  ┌─────────────┐ │                 │
│  │  │ Client  │  │   Server    │ │                 │
│  │  └─────────┘  └─────────────┘ │                 │
│  │       │              │         │                 │
│  │       └──────┬───────┘         │                 │
│  │              │                 │                 │
│  │        ┌─────▼──────┐         │                 │
│  │        │  MongoDB   │         │                 │
│  │        └────────────┘         │                 │
│  └────────────────────────────────┘                 │
│                                                       │
└──────────────────────────────────────────────────────┘
```

## Performance Optimizations

1. **Message Pagination**: Limit to 50 messages per load
2. **Lazy Loading**: Components loaded on demand
3. **Debounced Typing**: Typing indicators throttled
4. **WebSocket Rooms**: Efficient message broadcasting
5. **MongoDB Indexing**: Fast queries on user, server, channel
6. **Code Splitting**: Vite automatic code splitting
7. **Image Optimization**: Avatar URLs with compression
8. **Caching**: Browser caching for static assets

## Scalability Considerations

For future scaling:
- Use Redis for Socket.io adapter (multiple servers)
- Implement message queue (RabbitMQ/Kafka)
- CDN for static assets
- Load balancer for multiple server instances
- Database sharding for large datasets
- Microservices architecture for different features
