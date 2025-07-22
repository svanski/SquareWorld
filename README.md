# Square World

This project is an attampt tp buold a simplied universe where in place of ppl squares live in 2D square universe. Along the 

## Project Structure

```
├── ui/                     # React frontend application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # NestJS backend application
│   ├── src/               # NestJS source code
│   └── package.json       # Backend dependencies
└── package.json           # Root package.json with scripts
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

Install all dependencies (root, frontend, and backend):
```bash
npm run install:all
```

Or install them separately:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd ui && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### Development

To run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- React frontend on http://localhost:5173 (with Vite)
- NestJS backend on http://localhost:3001

**Note**: If port 5173 is already in use, Vite will automatically use the next available port. The backend will always run on port 3001.

You can also run them separately:

```bash
# Frontend only
npm run dev:ui

# Backend only
npm run dev:server
```

### Building for Production

Build both frontend and backend:
```bash
npm run build
```

Or build them separately:
```bash
# Frontend only
npm run build:ui

# Backend only
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
npm run start:ui

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
