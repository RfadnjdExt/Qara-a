# Qara-a (Mutabaah Online)

A modern web application for tracking student attendance and Quran memorization (Hafalan).

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Bun
- **Database**: Supabase (PostgreSQL + RLS)
- **UI Components**: Radix UI + Tailwind CSS + Lucide React
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed on your system.

### Installation
```bash
bun install
```

### Running Locally
```bash
bun run dev
```

### Database Setup
1. Create a Supabase project.
2. Run the SQL scripts in `scripts/` in order (01 -> 02 -> 03).
3. Set your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

## Key Features
- **Class Management**: Manage students and learning sessions.
- **Attendance Tracking**: Mark student presence with bulk actions.
- **Hafalan (Memorization)**: Track tajweed, tartil, and memorization levels.
- **Student Dashboard**: View evaluations and download reports.

## License
Apache-2.0
