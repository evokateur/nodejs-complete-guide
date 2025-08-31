# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### TypeScript (Primary)
- `npm run dev` - Run TypeScript version with hot reload using ts-node
- `npm run build` - Compile TypeScript to JavaScript in dist/
- `npm run build:watch` - Compile TypeScript in watch mode
- `npm start` or `npm run start` - Run compiled JavaScript from dist/

### JavaScript (Reference)
- `npm run dev:js` - Run JavaScript version with nodemon
- `npm run start:js` - Run JavaScript version without nodemon

### Environment Setup
- Copy `.env.example` to `.env` and set `MONGODB_URI`
- Default connection: `mongodb://localhost:27017/shop`
- Application runs on port 3000

## Architecture Overview

This is a dual-language Node.js e-commerce application ("Little Shop of Products") built following the **NodeJS - The Complete Guide** course through Section 13. The codebase represents a learning progression from basic Node.js concepts through MongoDB/Mongoose integration.

### Current Implementation Status
Completed through Section 13 (Working with Mongoose). Remaining sections include sessions/cookies, authentication, validation, error handling, file uploads, pagination, async requests, and payments.

### Project Structure
- **src/ts/** - Primary TypeScript implementation (compile target: dist/)
- **src/js/** - JavaScript reference implementation
- **views/** - EJS templates (shared by both implementations)
- **public/** - Static assets (CSS, client-side JS)
- **.resources/** - Course section examples and starting setups

### Technology Stack
- **Backend**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Templates**: EJS view engine
- **Authentication**: Simple user middleware (creates default user - no real auth yet)

### Code Organization Pattern
Both TypeScript and JavaScript follow identical MVC structure:
- **Models**: Mongoose schemas with TypeScript interfaces (User, Product, Order)
- **Controllers**: Request handlers for admin and shop functionality
- **Routes**: Express router modules for /admin and shop routes
- **Views**: EJS templates organized by feature (admin/, shop/, includes/)

### Key Architectural Decisions
1. **Dual Implementation**: Maintains both TS and JS for educational purposes
2. **Mongoose Integration**: Uses proper TypeScript interfaces extending Document
3. **Global Type Extensions**: Extends Express.Request to include user property
4. **Cart System**: Embedded cart subdocuments in User model
5. **Order System**: References user and cart data with transformation methods
6. **No Authentication Yet**: Uses default user - authentication planned for Sections 14-15

### Database Models
- **User**: username, email, cart (with items array)
- **Product**: title, price, imageUrl, description, userId reference
- **Order**: Static methods for creating from user cart, finding by user

### Development Notes
- TypeScript configuration targets ES2020, outputs to dist/
- Mixed import patterns: some routes still use require() for controllers (transitional state)
- User middleware creates default user if none exists (temporary until auth implementation)
- Cart operations use Mongoose methods with proper typing
- Course progression tracked in docs/sections.md