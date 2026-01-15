# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### "npm install" fails
**Problem**: Dependencies fail to install

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### TypeScript errors during build
**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Make sure you have the latest TypeScript
npm install -g typescript

# Clean and rebuild
rm -rf dist
npm run build
```

### Server Issues

#### "MongoDB connection failed"
**Problem**: Can't connect to MongoDB

**Solution 1** - Local MongoDB:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

**Solution 2** - Docker:
```bash
docker-compose up -d mongodb
```

**Solution 3** - Use MongoDB Atlas (cloud):
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string
- Update MONGODB_URI in .env

#### "JWT_SECRET is not configured"
**Problem**: Server won't start without JWT_SECRET

**Solution**:
```bash
# Generate a secure random secret
openssl rand -base64 32

# Add to server/.env
JWT_SECRET=<paste-generated-secret-here>
```

#### "Port 5000 already in use"
**Problem**: Another service is using port 5000

**Solution 1** - Change port in server/.env:
```env
PORT=3000
```

**Solution 2** - Kill process using port 5000:
```bash
# Find process
lsof -i :5000

# Kill it
kill -9 <PID>
```

#### "CORS errors" in browser console
**Problem**: Cross-origin requests blocked

**Solution**: Make sure CLIENT_URL in server/.env matches your frontend URL:
```env
CLIENT_URL=http://localhost:5173
```

### Client Issues

#### "Failed to fetch" or "Network error"
**Problem**: Can't connect to backend API

**Solution**:
1. Make sure the server is running on port 5000
2. Check VITE_API_URL in client/.env:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Restart the client: `npm run dev`

#### WebSocket connection fails
**Problem**: Real-time features not working

**Solution**:
1. Check VITE_SOCKET_URL in client/.env:
   ```env
   VITE_SOCKET_URL=http://localhost:5000
   ```
2. Check server logs for Socket.io errors
3. Try clearing browser cache and cookies
4. Restart both server and client

#### "Blank page" or "White screen"
**Problem**: React app not rendering

**Solution**:
```bash
# Check browser console for errors
# Clear cache
# Rebuild
npm run build
npm run dev
```

### Authentication Issues

#### "Authentication token invalid"
**Problem**: Can't stay logged in

**Solution**:
1. Clear browser localStorage:
   - Open DevTools (F12)
   - Go to Application/Storage tab
   - Clear Local Storage
2. Refresh page and log in again

#### "User already exists" on registration
**Problem**: Email or username already taken

**Solution**:
- Use a different email or username
- Or delete existing user from MongoDB:
  ```bash
  mongo chat-app
  db.users.deleteOne({ email: "user@example.com" })
  ```

### Voice/Video Call Issues

#### "Failed to access camera/microphone"
**Problem**: Browser blocks media access

**Solution**:
1. Grant camera/microphone permissions in browser
2. Use HTTPS in production (required for WebRTC)
3. Check browser console for detailed error

#### "Call not connecting"
**Problem**: Peer connection fails

**Solution**:
1. Both users must be online
2. Check firewall settings
3. For production, configure STUN/TURN servers:
   ```typescript
   // In client/src/components/VoiceCall/VoiceCall.tsx
   const peer = new SimplePeer({
     initiator: true,
     stream: mediaStream,
     config: {
       iceServers: [
         { urls: 'stun:stun.l.google.com:19302' },
         { urls: 'stun:stun1.l.google.com:19302' }
       ]
     }
   });
   ```

#### No audio/video in call
**Problem**: Media streams not working

**Solution**:
1. Check browser permissions
2. Test with: https://mozilla.github.io/webrtc-landing/gum_test.html
3. Try different browser
4. Check microphone/camera hardware

### Docker Issues

#### "docker-compose command not found"
**Problem**: Docker Compose not installed

**Solution**:
```bash
# Install Docker Desktop (includes Docker Compose)
# Or install docker-compose separately
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### "Cannot connect to Docker daemon"
**Problem**: Docker not running

**Solution**:
```bash
# Start Docker Desktop
# Or start Docker service
sudo systemctl start docker
```

#### Containers keep restarting
**Problem**: Service crashes immediately

**Solution**:
```bash
# Check logs
docker-compose logs server
docker-compose logs client

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Performance Issues

#### Slow message loading
**Problem**: Many messages cause lag

**Solution**:
- Messages are paginated by default (50 per page)
- Scroll to top to load more
- Consider implementing virtual scrolling for large channels

#### High CPU usage
**Problem**: Browser tab uses too much CPU

**Solution**:
1. Limit number of open channels
2. Close emoji picker when not in use
3. Disable video if only voice is needed
4. Update to latest browser version

### Database Issues

#### "Collection doesn't exist"
**Problem**: MongoDB collections not created

**Solution**:
Collections are created automatically when first document is inserted. Just start using the app.

#### "Duplicate key error"
**Problem**: Trying to create user with existing email/username

**Solution**:
```bash
# Reset database
mongo chat-app
db.dropDatabase()
```

### Development Issues

#### Hot reload not working
**Problem**: Changes not reflected

**Solution**:
```bash
# Kill all Node processes
killall node

# Clear cache and restart
rm -rf node_modules/.cache
npm run dev
```

#### ESLint errors
**Problem**: Linting issues

**Solution**:
```bash
# Auto-fix common issues
npm run lint:fix

# Or disable specific rules in .eslintrc.json
```

## Getting Help

If you're still experiencing issues:

1. **Check the logs**:
   - Server logs in the terminal running `npm run dev`
   - Client errors in browser DevTools Console (F12)

2. **Search existing issues**: https://github.com/DuckRoid/Teste/issues

3. **Open a new issue**: Include:
   - Operating system and version
   - Node.js version (`node -v`)
   - npm version (`npm -v`)
   - Error messages (full stack trace)
   - Steps to reproduce

4. **Enable debug mode**:
   ```env
   # In server/.env
   NODE_ENV=development
   DEBUG=*
   ```

## Useful Commands

```bash
# Check Node.js version
node -v

# Check npm version
npm -v

# Check if MongoDB is running
mongosh --eval "db.runCommand({ connectionStatus: 1 })"

# Check what's using a port
lsof -i :5000
netstat -ano | findstr :5000  # Windows

# View all Docker containers
docker ps -a

# Clean everything and start fresh
docker-compose down -v
rm -rf server/node_modules client/node_modules
./setup.sh
```
