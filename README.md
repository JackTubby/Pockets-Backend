# Pockets Backend
This is an API built for Pockets.

## Technologies
- Node.js using the Express.js framework.
  - I picked Express.js as I know it the best and I think for my requirements it suits them.
- TypeScript
  - I decided on TypeScript well for its types.
- Prisma ORM
  - I decided to use Prisma mainly for its ease of use and great schema and migration tools. I was going to use something like Knex.js, a lower level query builder, but for this project, I think making use of Prisma's *magic* works.
- Postgres
  - I picked Postgres because I think it's great 👌
- Jest
  - I chose to use Jest for familiarity, but I did consider Mocha for its speed.
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
