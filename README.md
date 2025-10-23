# GitHub Activity Tracker

A modern web application for tracking GitHub user activity, repositories, and webhook notifications. Built with Next.js 15, React 19, and HeroUI, this frontend integrates seamlessly with a FastAPI backend to provide real-time insights into your GitHub workflow.

## Features

- **GitHub OAuth Authentication** - Secure login with GitHub OAuth 2.0
- **Activity Tracking** - Monitor your repositories and GitHub events
- **Webhook Management** - Setup and manage GitHub webhooks for real-time notifications
- **Notification Center** - View and manage webhook notifications
- **Modern UI** - Built with HeroUI component library and Tailwind CSS 4
- **Dark Mode** - Dark theme enabled by default

## Tech Stack

- **Framework**: Next.js 15.5.6 with App Router
- **React**: 19.1.0
- **TypeScript**: 5 with strict mode
- **Build Tool**: Turbopack
- **Styling**: Tailwind CSS 4
- **UI Components**: HeroUI v2.8.5
- **Animation**: Framer Motion 12

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- pnpm package manager
- Backend API running on `http://localhost:8000` (see FRONTEND_API_GUIDE.md)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server with Turbopack
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Build

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
# Run ESLint
pnpm lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with fonts and providers
│   ├── page.tsx         # Homepage
│   ├── providers.tsx    # HeroUI provider wrapper
│   ├── globals.css      # Tailwind CSS 4 configuration
│   └── hero.ts          # HeroUI theme customization
```

## Backend Integration

This frontend connects to a FastAPI backend that provides:

- GitHub OAuth authentication with JWT tokens
- Repository and event data fetching
- Webhook setup and management
- Real-time notifications

API base URL: `http://localhost:8000/api/v1`

For detailed API documentation, see `FRONTEND_API_GUIDE.md`.

## Configuration

### Port Configuration

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

### Environment Variables

See `.env.example` for required environment variables (if applicable).

## Custom Fonts

The application uses three custom font families:

- **Sans**: Geist (variable: `--font-sans`)
- **Mono**: Anonymous Pro (variable: `--font-mono`)
- **Serif**: Space Grotesk (variable: `--font-serif`)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See [LICENSE](LICENSE) file for details.
