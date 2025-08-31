# Little Shop of Products

Coding along with [**NodeJS - The Complete Guide**](https://www.udemy.com/course/nodejs-the-complete-guide/)

This is the Products Shop app developed in [Sections 3 through 23](docs/sections.md), with the added twist of TypeScript

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
- JavaScript version preserved for reference and educational purposes

```
.
├── dist/                     # Compiled TypeScript output
└── src
    ├── js
    │   ├── app.js            # JavaScript entry point
    │   ├── controllers
    │   │   ├── admin.js
    │   │   ├── error.js
    │   │   └── shop.js
    │   ├── models
    │   │   ├── order.js
    │   │   ├── product.js
    │   │   └── user.js
    │   └── routes
    │       ├── admin.js
    │       └── shop.js
    └── ts
        ├── app.ts            # TypeScript entry point
        ├── controllers
        │   ├── admin.ts
        │   ├── error.ts
        │   └── shop.ts
        ├── models
        │   ├── order.ts
        │   ├── product.ts
        │   └── user.ts
        └── routes
            ├── admin.ts
            └── shop.ts
```

## Scripts

### TypeScript

```bash
npm run dev                   # Run TypeScript version with hot reload
npm run build                 # Compile TypeScript to JavaScript
npm run start                 # Run compiled JavaScript version, or just..
npm start
npm run build:watch           # Compile TypeScript in watch mode
```

### JavaScript

```bash
npm run dev:js                # Run JavaScript version
npm run start:js              # Run JavaScript version (no nodemon)
```
