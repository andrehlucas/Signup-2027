# Virtual Office Business Application

## Overview

This is a full-stack web application for a virtual office service provider, showcasing business services like virtual business addresses, call answering, and mail services. The project aims to provide a modern, responsive platform for managing virtual office solutions, built with a React frontend and an Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with React 18+ and TypeScript, utilizing Vite for fast development and Wouter for routing. UI components are developed with `shadcn/ui` based on Radix UI primitives and styled with Tailwind CSS, ensuring a responsive, mobile-first design with a custom color palette. State management for server interactions is handled by TanStack Query, while form management uses React Hook Form.

### Backend

The backend uses Express.js with TypeScript and Node.js. It follows an ESM module system with a clear API structure, where all endpoints are prefixed with `/api`. A storage interface abstraction is in place for data operations, currently using an in-memory solution but designed for database integration. Middleware handles JSON parsing, logging, and error management.

### Data Layer

Drizzle ORM is used for PostgreSQL database integration, with schema definitions shared between the client and server for type safety. Zod is integrated for runtime schema validation. The schema includes a `Users` table with UUID primary keys.

### Project Structure and Key Features

The application employs a Next.js App Router layout for the portal, with distinct sections for the server and shared code. Key features include:

-   **Portal Routes:** Dashboard, My Office, Phone, Addons, Account, Billing, Videos, Meeting Rooms, Support.
-   **Add New Location Wizard:** A multi-step flow for selecting a location, customizing services (bundles, phone numbers, add-ons), and checkout with various payment options and terms.
-   **Account Page:** Allows users to manage login credentials, security settings, and company details with validation and confirmation flows.
-   **Billing Page:** Displays current subscriptions, payment methods management (add, set default, delete cards), and a history of invoices with PDF download options.
-   **Portal Search:** A comprehensive search functionality across all portal pages, supporting keyword matching and keyboard navigation.
-   **Active Add-ons and Marketplace:** Components for managing active phone add-ons and a marketplace grid to discover and add new services. Includes Add to Plan and Remove from Plan flows with confirmation dialogs.
-   **Add-ons Context (AddonsContext):** Global state management for add-ons across the application, tracking active status and prices.
-   **Billing Integration:** Real-time billing integration that calculates monthly totals from base plan + add-on costs. Billing page shows detailed breakdown with individual add-on line items.
-   **My Mail Feature:** Enables users to review pending mail items, view envelope thumbnails, and take actions like scanning, forwarding, keeping, or shredding mail.
-   **Mobile Responsiveness:** Designed with an `lg` breakpoint for desktop/mobile views, featuring a fixed sidebar for desktop and a hamburger menu with a drawer for mobile.

## External Dependencies

### Third-Party UI Libraries

-   **Radix UI**: Core unstyled components.
-   **shadcn/ui**: Styled components built on Radix UI.
-   **Lucide React**: Icon library.
-   **Embla Carousel**: Carousel component.
-   **cmdk**: Command menu.
-   **vaul**: Drawer component.
-   **react-day-picker**: Date picker.

### State & Data Management

-   **TanStack Query v5**: Server state management.
-   **React Hook Form**: Form management.
-   **Zod**: Schema validation.
-   **Drizzle ORM**: TypeScript ORM for PostgreSQL.

### Styling & Utilities

-   **Tailwind CSS**: Utility-first CSS framework.
-   **class-variance-authority**: Component variant utilities.
-   **clsx & tailwind-merge**: Classname manipulation.
-   **date-fns**: Date utilities.

### Backend Services

-   **Express**: Web server framework.
-   **Neon Serverless**: PostgreSQL database driver.

### Development Tools

-   **Vite**: Frontend build tool.
-   **esbuild**: Production bundler.
-   **tsx**: TypeScript execution.
-   **Drizzle Kit**: Database migration CLI.
-   **TypeScript**: Type system.

### Database

-   **PostgreSQL**: Primary database accessed via Neon serverless driver.