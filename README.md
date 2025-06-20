# Little Shop of Products

Coding along with [**NodeJS - The Complete Guide**](https://www.udemy.com/course/nodejs-the-complete-guide/)

This is the Products Shop app developed in Sections 3 through ~23~ 13 (currently), with the added twist of TypeScript

![Capture d’écran 2025-06-09 à 15 35 37](https://github.com/user-attachments/assets/1774c6ff-8eb2-4934-925c-04af2c2902ad)

## Getting Started

### Clone and set up the project

```sh
git clone git@github.com:evokateur/nodejs-complete-guide.git
cd nodejs-the-complete-guide
npm install
```

### Configure MongoDB

Set up a free database with
[MongoDB Atlas](https://www.mongodb.com/atlas/database) or run a local instance.

Copy `.env.example` to `.env` and set `MONGODB_URI`

### Start the Application

```sh
npm run dev
```

Can be also be run as JavaScript:

```sh
npm run dev:js
```

The application should be available at <http://localhost:3000/>

## Project Structure

- Both JavaScript and TypeScript versions are fully functional
- Original JavaScript files are preserved for reference and head-scratching

```
.
├── app.js                    # Original JavaScript entry point
├── src
│   ├── app.ts                # TypeScript entry point
│   ├── controllers
│   │   ├── admin.js
│   │   ├── admin.ts
│   │   ├── error.js
│   │   ├── error.ts
│   │   ├── shop.js
│   │   └── shop.ts
│   ├── models
│   │   ├── order.js
│   │   ├── order.ts
│   │   ├── product.js
│   │   ├── product.ts
│   │   ├── user.js
│   │   └── user.ts
│   └── routes
│       ├── admin.js
│       ├── admin.ts
│       ├── shop.js
│       └── shop.ts
├── dist/                     # Compiled TypeScript output
```

## Scripts

### TypeScript

```bash
npm run dev                   # Run TypeScript version with hot reload
npm run build                 # Compile TypeScript to JavaScript
npm run start                 # Run compiled JavaScript version
npm run build:watch           # Compile TypeScript in watch mode
```

### JavaScript

```bash
npm run dev:js                # Run original JavaScript version
npm run start:js              # Run original JavaScript version (no nodemon)
```
