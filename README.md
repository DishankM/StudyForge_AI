# StudyForge

StudyForge is a SaaS-style study companion that turns documents into notes, MCQs, exam papers, and viva questions for college and exam-prep students.

## Features
- Document upload and AI-powered content generation
- Notes, MCQs, exam papers, and viva practice
- Dashboard with recent activity and quick actions
- Email-based verification and password reset (Brevo)

## Tech Stack
- Next.js (App Router)
- TypeScript
- Prisma
- NextAuth
- Tailwind CSS

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your environment file:
   ```bash
   copy .env.example .env
   ```
3. Configure environment variables in `.env`.
4. Generate Prisma client:
   ```bash
   npm run db:generate
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables
Set these in `.env`:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
- `GROQ_API_KEY`
- `REDIS_URL` (optional)

## Scripts
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push Prisma schema to DB

## Project Structure
- `app/` - Next.js routes
- `components/` - UI and feature components
- `lib/` - Server actions, auth, email, utilities
- `prisma/` - Prisma schema
- `public/` - Static assets

## Notes
- Email sending uses Brevo. Make sure the sender email is verified.

