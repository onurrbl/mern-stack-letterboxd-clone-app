# MERN Stack Kinda Letterboxd App

## Setup

1. Copy environment variables for the server:
   - `cd server`
   - `cp .env.example .env`
   - Fill in `MONGO_URI` and `JWT_SECRET`

2. Install dependencies:
   - `npm run install-all`

3. Run the server:
   - `npm run server:dev`

4. Run the frontend:
   - `npm run client:start`

## Available scripts

- `npm run install-all` - install both client and server dependencies
- `npm run client:start` - start the frontend dev server
- `npm run client:build` - build the frontend
- `npm run server:dev` - start the server with `ts-node-dev`

## Notes

- Frontend source now uses TypeScript and `tsx` components.
- Backend source now uses TypeScript and `ts` files.
- Both `client` and `server` compile successfully.
