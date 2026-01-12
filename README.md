# Terra

A simple project management system built with Node.js, Express, and MySQL. A Collage Minor Project

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL

## Prerequisites

- Node.js (version 18 or higher)
- MySQL

## Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sanayed/terra
   cd terra
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in your database credentials and JWT secrets:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your actual values for database connection and secrets.

4. **Set up the database**:
   Run migration (in `/migrations`)

5. **Run the application**:
   ```bash
   pnpm dev
   ```
   The server will start on `http://localhost:3000` (or the port specified in your `.env`).

## Usage

- Visit `http://localhost:3000` to access the home page.
- Sign up for a new account or log in with existing credentials.
- Access your protected dashboard at `/dashboard`.

## License

ISC
