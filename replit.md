# replit.md

## Overview

This is a full-stack web application built with a React frontend and Express.js backend, featuring a personal portfolio dashboard system. The application allows users to create accounts, manage projects, track skills, and showcase achievements through a modern, responsive interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Component Architecture**: Modular component-based design with reusable UI components
- **Theme System**: Dark/light mode support with CSS custom properties

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Session-based authentication with express-session
- **Security**: bcrypt for password hashing, session management for auth state
- **API Design**: RESTful API endpoints with proper error handling

## Key Components

### Database Schema
- **Users**: Core user information (username, email, password, profile data)
- **Projects**: User project portfolio items with metadata
- **Skills**: User skill tracking with proficiency levels
- **Achievements**: User accomplishments and milestones

### Frontend Components
- **Dashboard**: Main overview with stats and recent activity
- **Projects**: CRUD operations for portfolio projects
- **Profile**: User profile management
- **Skills**: Skill tracking and visualization
- **Achievements**: Achievement display and management
- **Analytics**: Performance metrics and insights

### Authentication System
- Session-based authentication with secure cookie management
- Registration/login flows with form validation
- Protected routes requiring authentication
- User profile management capabilities

## Data Flow

1. **Authentication Flow**: User registers/logs in → Session created → Auth state managed via React Query
2. **Data Fetching**: React Query manages API calls → Cached responses → Optimistic updates
3. **CRUD Operations**: Frontend forms → API endpoints → Database operations → UI updates
4. **Real-time Updates**: Mutations trigger cache invalidation → Fresh data fetched → UI reflects changes

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React icon library
- **Forms**: React Hook Form with Zod validation

### Backend Dependencies
- **Database**: Neon PostgreSQL serverless
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Authentication**: express-session with connect-pg-simple store
- **Security**: bcrypt for password hashing
- **WebSocket**: ws for Neon database connections

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Neon serverless PostgreSQL
- **Environment**: Replit-optimized configuration

### Production Build
- **Frontend**: Vite production build → static assets
- **Backend**: esbuild bundling → single Node.js executable
- **Database**: Drizzle migrations for schema management
- **Deployment**: Single command deployment with build optimization

### Configuration Management
- Environment variables for database connections
- Session secrets for authentication security
- Development/production mode detection
- Replit-specific optimizations and plugins

## Changelog
- July 04, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.