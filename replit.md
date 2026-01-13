# Virtual Office Business Application

## Overview

This is a full-stack web application for a virtual office service provider. The application showcases business services including virtual business addresses, professional call answering, mail receipt, and related office solutions. Built with a modern React frontend using shadcn/ui components and an Express backend with PostgreSQL database integration via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing (alternative to React Router)
- Path aliases configured for clean imports (`@/` for client src, `@shared/` for shared code)

**UI Component System**
- shadcn/ui component library in "new-york" style with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming (brand colors, grays, semantic colors)
- Custom color palette including brand colors (red-based), grays, and status colors
- Responsive design with mobile-first approach

**State Management**
- TanStack Query (React Query) for server state management and API communication
- Custom query client with infinite stale time and disabled refetching
- Toast notifications via Radix UI Toast primitives

**Component Organization**
- UI components in `client/src/components/ui/` (shadcn/ui generated)
- Custom components in `client/src/components/` (e.g., FeaturesBox)
- Pages in `client/src/pages/` with Desktop as main landing page
- Shared utilities in `client/src/lib/utils.ts`

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- ESM module system throughout the application
- Separation between development and production modes
- Custom logging middleware for API request tracking

**Development Tooling**
- tsx for TypeScript execution in development
- esbuild for production builds with bundling
- Replit-specific plugins for development (cartographer, dev-banner, runtime-error-modal)

**API Structure**
- Routes registered through `server/routes.ts`
- All API endpoints prefixed with `/api`
- HTTP server created using Node's native `http` module
- Storage interface abstraction for data operations

**Data Layer**
- Storage interface pattern (`IStorage`) for CRUD operations
- In-memory storage implementation (`MemStorage`) for development/testing
- Prepared for database integration with user management methods
- UUID generation using Node's crypto module

**Middleware Pipeline**
1. JSON body parsing
2. URL-encoded form parsing
3. Request logging with duration tracking and response capture
4. Route handlers
5. Global error handler with status code normalization

### Data Storage Solution

**ORM & Database**
- Drizzle ORM configured for PostgreSQL dialect
- Schema definitions in `shared/schema.ts` for code sharing between client and server
- Drizzle-Zod integration for schema validation
- Migration files output to `./migrations` directory
- Neon serverless PostgreSQL driver for database connectivity

**Schema Design**
- Users table with UUID primary keys (auto-generated)
- Username uniqueness constraint
- Password storage (should implement hashing in production)
- Type-safe schema exports using Drizzle's inference

**Validation**
- Zod schemas generated from Drizzle schemas for runtime validation
- Separate insert schemas for user creation

### Project Structure

**Next.js App Router Layout**
- `app/` - Next.js application with App Router (portal-only)
  - `page.tsx` - Portal dashboard (main page at /)
  - `portal-components/` - Portal-specific reusable components
  - `components/` - Shared UI components
    - `ui/` - shadcn/ui components
    - `NavigationProgress.tsx` - Page loading indicator
  - `layout.tsx` - Root layout (Providers, PortalSidebar, NavigationProgress, Toaster)
- `server/` - Backend Express application
- `shared/` - Shared TypeScript code (schemas, types)
- `attached_assets/` - Static image assets
- `public/` - Public static assets (images, SVGs)
- `migrations/` - Database migration files

**Portal Routes**
- `/` - Portal dashboard (locations overview)
- `/addons` - Addons page
- `/account` - Account details page
- `/billing` - Billing page
- `/videos` - How to / Videos page
- `/meeting-rooms` - Meeting rooms page
- `/support` - Support page

**Portal Reusable Components**
Located in `app/portal-components/`:
- `PromoBanner.tsx` - Dismissible promotional CTA banner
- `QuickActionCard.tsx` - Action card with icon, title, description
- `FeatureItem.tsx` - Package feature row with icon and label
- `LocationMedia.tsx` - Building image + map + address + action buttons
- `NavSection.tsx` - Collapsible sidebar navigation section with onNavigate callback
- `PortalSidebar.tsx` - Responsive sidebar with desktop view (lg+) and mobile drawer

**Mobile Responsiveness**
- Breakpoint: lg (1024px) separates desktop and mobile views
- Desktop (lg+): Fixed sidebar always visible on the left
- Mobile (below lg): Fixed header bar with hamburger menu, sidebar content in right-side Sheet drawer
- Drawer auto-closes when navigation links are clicked
- Main content has top padding (pt-16) on mobile to account for fixed header

**Build Process**
- Next.js handles client and server builds
- TypeScript compilation checks without emit
- Separate dev and production scripts

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Comprehensive unstyled component primitives (accordion, dialog, dropdown, select, toast, etc.)
- **shadcn/ui**: Pre-built accessible components built on Radix UI
- **Lucide React**: Icon library for UI elements
- **Embla Carousel**: Carousel/slider component
- **cmdk**: Command menu component
- **vaul**: Drawer component library
- **react-day-picker**: Date picker component

### State & Data Management
- **TanStack Query v5**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation and type safety
- **Drizzle ORM**: TypeScript ORM for PostgreSQL

### Styling & Utilities
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional className utilities
- **date-fns**: Date manipulation and formatting

### Backend Services
- **Express**: Web server framework
- **Neon Serverless**: PostgreSQL database driver optimized for serverless
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)

### Development Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: JavaScript bundler for production
- **tsx**: TypeScript execution for development
- **Drizzle Kit**: Database migration and management CLI
- **TypeScript**: Type system and compiler
- **Replit Plugins**: Development environment enhancements (Cartographer, dev banner, runtime error overlay)

### Database
- **PostgreSQL**: Primary database (via Neon serverless driver)
- Connection configured via `DATABASE_URL` environment variable
- Schema-first approach with Drizzle ORM migrations