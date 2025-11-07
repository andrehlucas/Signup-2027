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
- React Aria Components for sophisticated Button component with accessibility features
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming (brand colors, grays, semantic colors)
- Custom color palette including brand colors (blue #36BFFA primary), grays, and status colors
- Skeuomorphic button design with multi-layer shadows for depth effect
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

**Monorepo Layout**
- `client/` - Frontend React application
- `server/` - Backend Express application
- `shared/` - Shared TypeScript code (schemas, types)
- `attached_assets/` - Static image assets
- `migrations/` - Database migration files

**Build Process**
- Client builds to `dist/public` (served as static files in production)
- Server bundles to `dist/index.js` using esbuild
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

## Recent Changes

### Skeuomorphic Button System Implementation (November 2025)

Implemented a sophisticated button design system with skeuomorphic styling across the application:

**Design Specifications**
- Background color: #36BFFA (brand-solid)
- Border: 2px with rgba(255,255,255,0.12) via pseudo-element overlay
- Border radius: 8px
- Padding: 18px horizontal, 12px vertical (xl size)
- Multi-layer box shadow for depth effect

**Technical Implementation**
- Replaced Button component (`app/components/ui/button.tsx`) with React Aria Components-based version
- Supports multiple button colors: primary, secondary, tertiary, and destructive variants
- Four size options: sm, md, lg, xl
- Loading states with spinner animation
- Icon support (leading and trailing)
- Link button support (using AriaLink for accessible anchor elements)

**Shadow System**
The skeuomorphic shadow consists of three layers applied via inline styles:
1. Inner border: `0 0 0 1px rgba(10, 13, 18, 0.18) inset`
2. Top highlight: `0 -2px 0 0 rgba(10, 13, 18, 0.05) inset`
3. Ambient shadow: `0 1px 2px 0 rgba(10, 13, 18, 0.05)`

**CSS Variables** (`app/globals.css`)
- `--shadow-skeumorphic-inner-border`: rgba(10, 13, 18, 0.18)
- `--shadow-skeumorphic-inner`: rgba(10, 13, 18, 0.05)
- `--shadow-skeuomorphic-ambient`: rgba(10, 13, 18, 0.05)

**Tailwind Configuration** (`tailwind.config.ts`)
- Extended boxShadow utilities with `xs-skeumorphic` variant
- Added custom color tokens for button states
- Custom plugin for special CSS selectors (mask-b-from-0%, transition-inherit-all)

**Utility Functions** (`app/utils/`)
- `cx.ts`: Conditional className utility using clsx and tailwind-merge
- `is-react-component.ts`: Type guard for React component detection

**Button Usage Patterns**
```tsx
// Primary button
<Button size="xl" color="primary">Sign Up</Button>

// Secondary button  
<Button size="md" color="secondary">Learn More</Button>

// Tertiary (text-only) button
<Button size="md" color="tertiary">Cancel</Button>

// Link button
<Button href="/about" color="link-color">Read More</Button>
```

**Critical Fix**
Initial implementation had an issue where the shadow CSS variable contained a complete shadow definition instead of just the color value. This caused the browser to reject the entire box-shadow declaration. Fixed by creating a color-only variable (`--shadow-skeuomorphic-ambient`) for use in the shadow definition.