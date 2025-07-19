# Square World

A simulation application with a React frontend using Vite and a NestJS backend.

## Project Structure

```
├── src/                    # React frontend source
├── server/                 # NestJS backend
├── public/                 # Static assets
└── package.json           # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
cd ..
```

### Development

To run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- React frontend on http://localhost:3000 (with Vite)
- NestJS backend on http://localhost:3001

**Note**: If port 3000 is already in use, Vite will automatically use the next available port (like 3001, 3002, etc.). The backend will always run on port 3001.

You can also run them separately:

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

### Building for Production

Build the frontend:
```bash
npm run build
```

Build the backend:
```bash
npm run build:server
```

### Running in Production

Start both services:
```bash
npm start
```

Or run them separately:
```bash
# Frontend (preview mode)
npm run preview

# Backend
npm run start:server
```

## Features

- **React Frontend**: Built with Vite for fast development and building
- **NestJS Backend**: Provides API endpoints for simulation logic
- **Material-UI**: UI components library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Full TypeScript support for both frontend and backend

## API Endpoints

- `GET /api/simulation/health` - Health check
- `POST /api/simulation/create-world` - Create a new world
- `POST /api/simulation/add-person` - Add a person to the simulation
- `POST /api/simulation/move-people` - Move people in the simulation
- `POST /api/simulation/add-rewards` - Add rewards to the world

## Development Notes

The frontend communicates with the backend through API calls. The Vite dev server proxies `/api` requests to the NestJS server running on port 3001.
