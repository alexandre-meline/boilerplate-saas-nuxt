# Ecole2600 Saas Boilerplate

This is a boilerplate for a SaaS project based on Nuxt.js and Supabase.

## Features

Authentication
  - Email & Password
  - OAuth

Subscription
  - Stripe

Payment
  - Stripe
  
Database
  - Supabase

## Tech Stack

- [Nuxt.js](https://nuxtjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.io)
- [Stripe](https://stripe.com)

## Requirements

- Node.js
- npm or pnpm or yarn
- Supabase account
- Stripe account

## Quick Start

### Clone the repository

```bash
git clone https://github.com/alexandre-meline/boilerplate-saas-nuxt.git
```

Go to project

```bash
cd boilerplate-saas-nuxt
```

### Init project: manually

```bash[Terminal]
touch ./env
```

and adding environnement variables in .env file

```bash
# Application url
APP_URL=http://localhost:3000
# Production license for @nuxt/ui-pro, get one at https://ui.nuxt.com/pro/purchase
NUXT_UI_PRO_LICENSE=
# Public URL, used for OG Image when running nuxt generate
NUXT_PUBLIC_SITE_URL=

# Database 'Supabase':
SUPABASE_URL= https://<project_id>.supabase.co
SUPABASE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres.<project_id>:<your_password>@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Payment 'Stripe':
STRIPE_PUBLIC_KEY=pk_test_51P8M...
STRIPE_SECRET_KEY=sk_test_51P8M...
STRIPE_WEBHOOK_SECRET_KEY=whsec_...
```

### Init project: Automatic

You can use the `configproject` script to configure your project automatically.

```bash
chmod +x ./configproject
./configproject
```

## Recurring commands

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

-----
