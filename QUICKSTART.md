# Quick Start Guide

## Prerequisites
- Node.js v18 or higher
- npm or yarn
- MongoDB v7.0 or higher (or Docker)

## Method 1: Automatic Setup (Recommended)

### On Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

### On Windows:
```cmd
setup.bat
```

After running the setup script:

1. **Configure environment variables** in `server/.env`:
   ```env
   JWT_SECRET=your_secure_random_string_here
   MONGODB_URI=mongodb://localhost:27017/chat-app
   ```

2. **Start MongoDB** (if not using Docker):
   ```bash
   mongod
   ```

3. **Start the server**:
   ```bash
   cd server
   npm run dev
   ```

4. **Start the client** (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser** at: http://localhost:5173

## Method 2: Docker Compose (Easiest)

1. **Create environment file**:
   ```bash
   echo "JWT_SECRET=$(openssl rand -base64 32)" > .env
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Open your browser** at: http://localhost:5173

4. **View logs**:
   ```bash
   docker-compose logs -f
   ```

5. **Stop services**:
   ```bash
   docker-compose down
   ```

## Method 3: Manual Setup

### Server Setup:
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Client Setup:
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## First Time Usage

1. **Register a new account**:
   - Go to http://localhost:5173/register
   - Create your username, email, and password

2. **Create a server**:
   - Click the "+" button in the left sidebar
   - Enter a server name

3. **Create channels**:
   - Click the "+" next to "Text Channels" or "Voice Channels"
   - Enter a channel name

4. **Start chatting**:
   - Select a text channel
   - Type your message and press Enter or click Send

## Testing Voice/Video Calls

To test voice/video calls, you need two different users:

1. Open the app in two different browsers (e.g., Chrome and Firefox)
2. Register two different accounts
3. Join the same server with both accounts
4. One user initiates a call from a voice channel
5. The other user should receive the call

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in server/.env
2. Use a strong, random JWT_SECRET
3. Use a production MongoDB instance (MongoDB Atlas recommended)
4. Build the client: `cd client && npm run build`
5. Serve the client build folder with a web server (Nginx, Apache, or serve from Express)
6. Use HTTPS for secure connections
7. Configure CORS properly for your domain
8. Set up proper firewall rules
9. Use environment variables for all sensitive configuration

## Next Steps

- Invite friends to your server
- Create multiple channels for different topics
- Try voice and video calls
- Customize your profile
- Explore the modern UI features
