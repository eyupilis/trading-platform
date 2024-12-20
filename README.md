# Trading Platform

A real-time trading platform with a web dashboard and mobile app for creating and monitoring trade signals.

## Features

- Real-time trade signal updates using WebSocket
- Web-based trader dashboard for creating signals
- Mobile app for monitoring signals
- Authentication system
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express
- WebSocket (ws)
- MongoDB

### Trader Dashboard (Web)
- React
- Material-UI
- WebSocket API
- Axios

### Mobile App
- React Native (Expo)
- Redux Toolkit
- WebSocket API
- Axios

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/trading-platform.git
cd trading-platform
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install trader dashboard dependencies
cd ../trader-dashboard
npm install

# Install mobile app dependencies
cd ../mobile-app
npm install
```

3. Start the services:

```bash
# Start backend server (from backend directory)
npm start

# Start trader dashboard (from trader-dashboard directory)
npm start

# Start mobile app (from mobile-app directory)
npm run web  # For web version
# or
npm start    # For mobile development
```

4. Access the applications:
- Backend API: http://localhost:5001
- WebSocket Server: ws://localhost:5002
- Trader Dashboard: http://localhost:3000
- Mobile App (Web): http://localhost:19006

## License

MIT License - see the [LICENSE](LICENSE) file for details
