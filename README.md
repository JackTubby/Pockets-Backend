# Pockets Backend
This is an API built for Pockets.

## Technologies
- Node.js using the Express.js framework.
- TypeScript
- Prisma ORM
- Postgres
- Jest
## User Stories
## Schema
## Testing
## Deployment
## How to run the app in dev
To run the app in development follow these steps:

- Add files to your local editor.
- Docker
  - First check you have docker installed
  - Run the command `docker-compose up` to see logs or `docker-compose up -d` to not see logs.
  - Run Prisma migrations by running the command `npx prisma migrate dev`
- Node server
  - Run the command `npm run dev` to start the server

After this you should now be able to use the API.
### Commands
- Run server - `npm run dev`
- Run Posgres via Docker - `docker-compose up -d`
- Run dev migrations - `npx prisma migrate dev`
## Resources
## Support

## Directory Structure
src/
├── config/              # Application configuration
│   └── index.ts         # Environment variables, constants, etc.
│
├── db/
│   └── index.ts         # Prisma initialization (your current db.ts)
│
├── services/            # Business logic layer
│   ├── userService.ts   # User-related business logic
│   ├── productService.ts
│   └── ... (other services)
│
├── utils/               # Generic utilities
│   ├── dateUtils.ts
│   ├── validationUtils.ts
│   └── ... (other utilities)
│
├── helpers/             # Application-specific helpers
│   ├── responseHelpers.ts  # Format API responses consistently
│   └── ... (other helpers)
│
├── middleware/          # Express middleware
│   ├── auth.ts          # Authentication middleware
│   ├── errorHandler.ts  # Global error handling
│   └── ... (other middleware)
│
├── routes/              # Keep your current route organization
│   ├── users/
│   │   ├── handlers.ts  # Slimmed down to call services
│   │   └── routes.ts    # Route definitions (optional split)
│   ├── products/
│   │   ├── handlers.ts
│   │   └── routes.ts
│   └── ... (other route modules)
│
├── index.ts             # Entry point (unchanged)
├── router.ts            # Main router that imports from routes/
└── server.ts            # Server configuration (unchanged)