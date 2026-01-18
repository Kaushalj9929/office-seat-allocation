# Office Seat Allocation - Frontend

React + TypeScript + Vite frontend application for the Office Seat Allocation System.

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── docs/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_VERSION=v1
VITE_APP_NAME=Office Seat Allocation
```

