# GitHub Activity Tracker

A modern, full-featured web application for tracking GitHub user activity, repositories, and webhook notifications. Built with Next.js 15, React 19, and HeroUI, this frontend integrates seamlessly with a FastAPI backend to provide real-time insights into your GitHub workflow.

## ✨ Features

### Core Features
- **🔐 GitHub OAuth Authentication** - Secure login with GitHub OAuth 2.0 and JWT tokens
- **📊 Activity Dashboard** - Comprehensive view of your GitHub statistics and recent activity
- **📦 Repository Management** - Browse, search, and filter your GitHub repositories
- **🔔 Webhook Management** - Setup and manage GitHub webhooks for real-time notifications
- **📬 Notification Center** - View, filter, and manage webhook notifications
- **📈 Analytics** - Visualize your GitHub activity with interactive charts
- **🎨 Modern UI** - Beautiful interface built with HeroUI component library
- **🌙 Dark Mode** - Dark theme enabled by default with smooth transitions

### User Experience
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Loading States** - Skeleton screens for better perceived performance
- **Error Handling** - Comprehensive error messages with retry functionality
- **Empty States** - Helpful guidance when no data is available
- **Search & Filter** - Powerful search and filtering capabilities
- **Real-time Updates** - Live webhook notifications

## 🛠 Tech Stack

### Frontend Framework
- **Framework**: Next.js 15.5.6 with App Router
- **React**: 19.1.0 (latest features)
- **TypeScript**: 5 with strict mode enabled
- **Build Tool**: Turbopack (for both dev and production)

### Styling & UI
- **Styling**: Tailwind CSS 4 (CSS-first configuration)
- **UI Components**: HeroUI v2.8.5
- **Icons**: Lucide React
- **Animation**: Framer Motion 12

### State Management & Data
- **Authentication**: JWT-based with context API
- **HTTP Client**: Fetch API with custom wrappers
- **Local Storage**: Token management

### Testing
- **Test Framework**: Vitest
- **Testing Library**: @testing-library/react
- **Coverage**: 395 passing tests

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

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Linting

```bash
# Run ESLint
pnpm lint
```

## 📁 Project Structure

```
github-tracker-app/
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── layout.tsx            # Root layout with fonts and providers
│   │   ├── page.tsx              # Homepage/Dashboard
│   │   ├── providers.tsx         # HeroUI provider wrapper
│   │   ├── globals.css           # Tailwind CSS 4 configuration
│   │   ├── hero.ts               # HeroUI theme customization
│   │   ├── login/                # Login page
│   │   ├── callback/             # OAuth callback handler
│   │   ├── repositories/         # Repositories page
│   │   ├── events/               # Events/Activity page
│   │   └── analytics/            # Analytics page
│   ├── components/               # React components
│   │   ├── AuthButton.tsx        # Authentication button
│   │   ├── ErrorMessage.tsx      # Error display component
│   │   ├── Footer.tsx            # Application footer
│   │   ├── Loading.tsx           # Loading skeletons
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── PrivacyModal.tsx      # Privacy Policy modal
│   │   ├── TermsModal.tsx        # Terms and Conditions modal
│   │   ├── RepositoryCard.tsx    # Repository card component
│   │   ├── RepositoryCardSkeleton.tsx
│   │   ├── events/               # Event-related components
│   │   │   ├── DateSeparator.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── EventCard.tsx
│   │   │   └── EventIcon.tsx
│   │   └── shared/               # Shared components
│   │       ├── PageHeader.tsx
│   │       └── StatsCard.tsx
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.tsx       # Authentication context
│   ├── lib/                      # Utilities and libraries
│   │   ├── api.ts                # API client
│   │   └── utils.ts              # Utility functions
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── github.ts
│   │   └── webhook.ts
│   └── test/                     # Test utilities
│       └── test-utils.tsx        # Custom render with providers
├── public/                       # Static assets
├── FRONTEND_API_GUIDE.md         # API documentation
├── CLAUDE.md                     # Development guidelines
└── README.md                     # This file
```

## 🚀 Application Routes

### Public Routes
- `/` - Homepage (redirects to login if not authenticated)
- `/login` - Login page with GitHub OAuth
- `/callback` - OAuth callback handler (auto-redirects)

### Protected Routes (require authentication)
- `/` - Dashboard with activity overview
- `/repositories` - Browse and manage repositories
- `/events` - View GitHub activity events
- `/analytics` - Activity analytics and visualizations

## 🔑 Authentication Flow

1. User clicks "Login with GitHub" on `/login`
2. Redirected to GitHub OAuth authorization
3. GitHub redirects back to `/callback?code=...`
4. Backend exchanges code for access token
5. Frontend stores JWT tokens in localStorage
6. User redirected to dashboard
7. All API requests include `Authorization: Bearer <token>` header
8. Token refresh handled automatically on 401 responses

## 🔌 Backend Integration

This frontend connects to a FastAPI backend that provides:

### Authentication Endpoints
- **POST** `/api/v1/auth/github/login` - Initiate GitHub OAuth flow
- **GET** `/api/v1/auth/github/callback` - OAuth callback handler
- **POST** `/api/v1/auth/refresh` - Refresh access token
- **GET** `/api/v1/auth/me` - Get current user profile
- **POST** `/api/v1/auth/logout` - Logout user

### Activity Endpoints
- **GET** `/api/v1/activity/repositories` - List user repositories
- **GET** `/api/v1/activity/events` - Get GitHub events

### Webhook Endpoints
- **POST** `/api/v1/webhooks/setup/{owner}/{repo}` - Setup webhook
- **GET** `/api/v1/webhooks/list/{owner}/{repo}` - List webhooks
- **DELETE** `/api/v1/webhooks/remove/{owner}/{repo}/{hook_id}` - Remove webhook
- **GET** `/api/v1/webhooks/notifications` - Get notifications
- **POST** `/api/v1/webhooks/notifications/{id}/mark-processed` - Mark as read
- **POST** `/api/v1/webhooks/notifications/mark-all-processed` - Mark all as read

### Rate Limits
- Auth endpoints: 5 req/min
- Activity endpoints: 50 req/min
- Webhook reads: 30 req/min
- Webhook writes: 5 req/min

**📖 For detailed API documentation, see `FRONTEND_API_GUIDE.md`**

## ⚙️ Configuration

### Port Configuration
- **Frontend**: `http://localhost:3000` (Next.js default)
- **Backend API**: `http://localhost:8000` (FastAPI)
- **CORS Configured**: `http://localhost:8002` (adjustable)

### Environment Variables
Create a `.env.local` file in the root directory (if needed):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Custom Fonts
The application uses three custom font families loaded via Next.js Font optimization:

- **Sans**: Geist (variable: `--font-sans`) - Primary interface font
- **Mono**: Anonymous Pro (variable: `--font-mono`) - Code and monospace text
- **Serif**: Lato (variable: `--font-serif`) - Accent text

### Tailwind CSS 4 Configuration
The project uses the new Tailwind CSS 4 with CSS-first configuration in `src/app/globals.css`:

```css
@import "tailwindcss";
@plugin "./hero.ts";  /* HeroUI plugin */
@source "../../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}";

@theme {
  /* Custom theme tokens */
}
```

## 🧩 Key Components

### Layout Components
- **Navbar** - Main navigation with authentication state
- **Footer** - Site footer with Terms and Privacy links
- **PageHeader** - Reusable page header with title and actions

### Feature Components
- **RepositoryCard** - Display repository information
- **EventCard** - Display GitHub activity events
- **StatsCard** - Display statistics with icons
- **AuthButton** - Login/Logout button with user info

### Modal Components
- **TermsModal** - Terms and Conditions (fully in English)
- **PrivacyModal** - Privacy Policy (fully in English, GDPR/CCPA compliant)

### State Components
- **Loading Skeletons** - Skeleton screens for all major pages
- **ErrorMessage** - Consistent error display with retry
- **EmptyState** - Helpful empty state messages

## 📝 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent component structure
- Comprehensive test coverage (395 tests)

### Component Guidelines
- Use `"use client"` directive for interactive components
- Prefer HeroUI components over custom implementations
- Follow the existing font variable pattern
- Dark mode is default (className="dark" on html tag)

### Testing
- All components have corresponding `.test.tsx` files
- Use custom `render` from `@/test/test-utils` for provider wrapping
- Mock API calls using Vitest
- Aim for high test coverage

## 📚 Documentation

- **README.md** - This file (project overview)
- **FRONTEND_API_GUIDE.md** - Complete API documentation with examples
- **CLAUDE.md** - Development guidelines for AI assistance
- **Component Tests** - Each component has inline documentation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Run linter (`pnpm lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Checklist
- [ ] Code follows TypeScript strict mode
- [ ] All tests pass
- [ ] New features include tests
- [ ] Components are documented
- [ ] ESLint warnings resolved
- [ ] Responsive design tested

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [HeroUI](https://heroui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Built for developers seeking complete visibility of their GitHub workflow** 🚀
