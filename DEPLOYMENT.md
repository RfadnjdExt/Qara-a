# Deployment Guide - Mutabaah Online

## Overview

Mutabaah Online is a production-ready Learning Management System for Tahfidz institutions. This guide covers deployment to Vercel with Supabase.

## Prerequisites

- Vercel Account (vercel.com)
- Supabase Project (supabase.com)
- PostgreSQL database (via Supabase)
- Node.js 18+ (for local development)

## Step 1: Database Setup

### 1.1 Create Supabase Project

1. Visit supabase.com and create a new project
2. Save your Project URL and Anon Key
3. Run the database migration scripts:
   - Execute `/scripts/01_initial_schema.sql` in Supabase SQL Editor

### 1.2 Configure RLS Policies

The schema includes basic RLS setup. For production, implement detailed policies:

```sql
-- Example: Users can only see their own evaluations
CREATE POLICY "Users can view own evaluations" ON evaluations
  FOR SELECT USING (auth.uid() = user_id);
```

## Step 2: Environment Variables

### 2.1 Copy `.env.example` to `.env.local`

```bash
cp .env.example .env.local
```

### 2.2 Fill in Supabase Credentials

Get these from your Supabase project settings:

- `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)
- `SUPABASE_JWT_SECRET` - JWT secret

## Step 3: Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

Test all user roles:
- Admin: Institution management
- Guru: Session & evaluation creation
- Murid: View evaluations and reports

## Step 4: Deploy to Vercel

### 4.1 Connect Repository

1. Push code to GitHub/GitLab
2. Visit vercel.com/new
3. Select your repository
4. Vercel auto-detects Next.js

### 4.2 Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret
POSTGRES_URL=your_postgres_url
```

### 4.3 Configure Production Redirect

Set for Auth redirects:

```
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=https://yourdomain.vercel.app
```

### 4.4 Deploy

Click "Deploy" and Vercel builds and deploys automatically.

## Step 5: Post-Deployment

### 5.1 Verify Deployment

1. Visit your Vercel domain
2. Test login with test account
3. Verify all role-based dashboards work

### 5.2 Setup Initial Data

1. Login as admin
2. Create institution
3. Add semesters and classes
4. Invite teachers and students

### 5.3 Configure Custom Domain

In Vercel Settings → Domains, add your custom domain and configure DNS.

## Security Checklist

- [ ] Environment variables set in Vercel (not in code)
- [ ] RLS policies enabled in Supabase
- [ ] Service role key stored securely
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Redirect URLs configured correctly
- [ ] Database backups enabled in Supabase
- [ ] Rate limiting configured if needed

## Troubleshooting

### Auth Not Working

1. Check `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Verify Anon Key is public (not service role)
3. Ensure middleware is processing requests

### Database Connection Errors

1. Verify `POSTGRES_URL` is set
2. Check database is running in Supabase
3. Test connection directly if possible

### Evaluations Not Saving

1. Check RLS policies allow inserts
2. Verify user_id is being set correctly
3. Check database logs in Supabase

## Performance Optimization

1. **Caching**: Leverage Next.js ISR/caching headers
2. **Images**: Use Vercel Image Optimization
3. **Database**: Add indexes to frequently queried fields
4. **Analytics**: Monitor with Vercel Analytics

## Monitoring & Maintenance

1. **Vercel Dashboard**: Monitor function execution, errors
2. **Supabase Dashboard**: Check database health, RLS logs
3. **Error Tracking**: Implement Sentry for production errors
4. **Regular Backups**: Enable daily backups in Supabase

## Support & Updates

- GitHub Issues: For bugs and feature requests
- Documentation: See README.md for system overview
- Support: Contact your Supabase support for database issues

## Version History

- v1.0.0 (2025-01-01): Initial release
  - Multi-role authentication
  - Admin dashboard for institution management
  - Guru panel for session and evaluation management
  - Murid panel for viewing evaluations and reports
  - PDF report generation
  - Role-based access control
`
