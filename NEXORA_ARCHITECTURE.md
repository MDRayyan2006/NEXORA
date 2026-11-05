# NEXORA Architecture

## Overview

NEXORA is an AI-Powered Learning Intelligence & Human Capability Discovery Platform that helps users discover their potential, transform learning, and unlock opportunities through personalized capability assessment and pathway discovery.

## System Architecture

### Frontend

- **Framework**: Next.js 16.4.5 with App Router
- **Language**: TypeScript + React 19
- **Styling**: Tailwind CSS v4 with CSS variables (navy/teal brand palette)
- **UI Components**: Radix UI primitives + custom shadcn-style components
- **State Management**: Zustand + React Query v5
- **Routing**: Next.js file-based routing with `(public)` and `(auth)` route groups

### Key Pages/Routes

| Route Group | Path | Description |
|---|---|---|
| `(public)` | `/sign-in`, `/sign-up`, `/` | Public landing, authentication |
| `(auth)` | `/dashboard`, `/learn` | Authenticated user routes |
| Root | `/dashboard`, `/capabilities`, `/missions`, `/opportunities` | Main app navigation |

### Components

- **AppShell**: Layout wrapper with Sidebar navigation
- **PublicNav**: Responsive navigation bar for public pages
- **Sidebar**: Collapsible navigation for authenticated users
- **UI Kit**: Button, Card, Badge, Progress, Input, Textarea, Select, Avatar, Spinner, EmptyState, Alert, Tooltip
- **EmptyState**: Reusable for loading/no-data states



### Data Layer

- **Supabase**: Backend-as-a-service for auth, database, and storage
- **Supabase SSR**: Server-side data fetching with `@supabase/ssr`
- **Database Tables**: `learner_profiles`, assessment responses, capability tracking
- **Data Fetching**: React Query v5 for caching and synchronization

### Styling & Design

- **Color Palette**: Navy (`#0f2037`), Teal (`#14b8a6`), Slate (`#0f2037` gradients)
- **Dark Mode**: Supported via `data-[theme=dark]` attributes and `next-themes`
- **Typography**: Inter font family (300-800 weights)
- **Responsive**: Mobile-first with breakpoints at 640px, 768px, 1024px

### Key Integrations

- **Supabase Auth**: Email/password authentication with user profiles
- **TanStack React Query**: Data fetching, caching, and server state management
- **Framer Motion**: Page transitions and micro-interactions
- **Lucide React**: Icon set
- **React Flow**: Concept graph visualization
- **Recharts**: Data visualization for analytics

## Deployment Configuration

### Build Settings

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "noEmit": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "isolatedModules": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Next.js Config

```typescript
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
};
export default nextConfig;
```

### Recommended Deployment (Vercel)

1. Connect the repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for server-side ops)
3. Deploy — Vercel automatically detects the Next.js framework
4. Enable `NEXT_PUBLIC_MODE=production` for production features

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anonymous key for client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key for server-side operations |
| `NEXT_PUBLIC_BASE_URL` | No | Base URL for absolute links |

### Production Checklist

- [ ] Remove `ignoreDuringBuilds: true` from eslint once ESLint errors are fixed
- [ ] Remove `ignoreBuildErrors: true` from typescript once type errors are resolved
- [ ] Configure custom domain and HTTPS
- [ ] Set up monitoring with Vercel Analytics
- [ ] Enable automatic cache invalidation
- [ ] Test OAuth providers if configured
- [ ] Verify Supabase realtime subscriptions work in production

## Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start
```

### Code Standards

- TypeScript strict mode enabled
- ESLint with Next.js config
- Tailwind CSS v4 with `clsx` and `tailwind-merge` for className management
- Component conventions: `PascalCase` for React components, `camelCase` for hooks and utilities
- All new components go in `src/components/`, utilities in `src/lib/`

## Roadmap

### Phase 1 — MVP (Current)

- [x] Core authentication (Sign In / Sign Up)
- [x] Navigation & layout (AppShell, Sidebar, PublicNav)
- [x] UI component library
- [x] Basic capability taxonomy
- [x] Demo data replacement with production structures

### Phase 2 — Learning Workspace

- [ ] Concept graph visualization with React Flow
- [ ] Gap diagnosis engine
- [ ] AI Companion integration
- [ ] Focus mode with pomodoro timer

### Phase 3 — Discovery & Opportunities

- [ ] Capability compiler with skills mapping
- [ ] Skill transfer link recommendations
- [ ] Career path personalization
- [ ] Real opportunity integration with job boards

### Phase 4 — Scale

- [ ] Multi-tenant SaS architecture
- [ ] Advanced analytics and reporting
- [ ] API platform for third-party integrations
- [ ] White-label capabilities