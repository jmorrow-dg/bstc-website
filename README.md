This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Community rollout

The `/join` page contains the native community form. Registrations and standalone
newsletter opt-ins append directly to a private Google Sheet. Chat invitations
are server-only and returned after a confirmed save; email and directory choices
are independent. No form-service subscription is needed for capture.

See [Google Sheets setup](docs/google-sheets-signups.md) for the one-time service
account connection and [the rollout guide](docs/community-rollout.md) for channel
setup and the event publishing workflow. Start from `.env.example`; store actual
credentials only in hosting secrets, never in this repository.

Run focused event-date, signup validation and mocked Google API tests using
Node.js 22.18+ (or Node.js 24):

```bash
npm test
```

Tests never write real signup rows. After installing dependencies, validate the
full application with `npm run build`.
