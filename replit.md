# FitLife Pro - Comprehensive Fitness & Nutrition Tracking Application

## Overview

FitLife Pro is a comprehensive fitness and nutrition tracking application designed to help users manage their exercise routines, monitor nutrition intake, track body metrics, and achieve their health goals. The application combines modern web technologies to deliver a mobile-first experience with features including workout tracking, nutrition logging with barcode scanning capabilities, progress monitoring, and ML-powered predictions for calorie burn and weight management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **State Management**: React Context API for global app state (user, navigation, onboarding status)
- **Data Fetching**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules for modern JavaScript features
- **API Design**: RESTful API architecture with JSON request/response format
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod for runtime type checking and data validation
- **Development**: Hot reload with middleware-based development server

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle with connection pooling
- **ORM Configuration**: Drizzle Kit for schema migrations and database management
- **Connection**: Neon serverless PostgreSQL for scalable cloud database hosting
- **Schema Design**: Relational model supporting users, workouts, exercises, nutrition logs, body metrics, and ML predictions

### Authentication and Authorization
- **Session Management**: Cookie-based sessions using connect-pg-simple for PostgreSQL session storage
- **User Management**: Custom user registration and authentication system
- **Data Isolation**: User-scoped data access patterns ensuring privacy and security

### External Dependencies
- **Database Hosting**: Neon serverless PostgreSQL for production database
- **UI Components**: Radix UI primitives for accessible component foundation
- **Charts & Visualization**: Custom chart components for progress tracking and analytics
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns library for date manipulation and formatting
- **Machine Learning**: Custom prediction algorithms for calorie burn and weight loss estimation
- **Development Tools**: Replit-specific plugins for development environment integration

### Key Architectural Decisions

**Mobile-First Approach**: The application is designed primarily for mobile devices with a responsive layout that works across all screen sizes. Bottom navigation and floating action buttons optimize for touch interaction.

**Component-Based Architecture**: Utilizes a modular component system with reusable UI components, custom hooks for cross-cutting concerns (theme, haptic feedback, mobile detection), and shared state management.

**Type Safety**: Full TypeScript implementation across frontend and backend with shared schema definitions ensuring consistency between client and server data models.

**Performance Optimization**: Vite for fast builds and hot reloading, React Query for efficient data caching and synchronization, and lightweight routing with Wouter to minimize bundle size.

**Scalable Database Design**: PostgreSQL with Drizzle ORM provides strong typing, migration support, and scalable connection pooling suitable for production deployment.