# Supabase Setup Guide for ICT Hubs Website

This guide will help you set up Supabase for database functionality including newsletter subscriptions, contact forms, and booking systems.

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name:** ICT Hubs Website
   - **Database Password:** (create a strong password and save it)
   - **Region:** Choose a region close to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: https://xyz.supabase.co)
   - **anon public key** (starts with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)

## Step 3: Update Supabase Configuration

1. Open the file: `js/supabase-config.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key
   ```
3. Save the file

## Step 4: Create Database Tables

### Newsletter Subscribers Table

1. In Supabase dashboard, go to **Table Editor**
2. Click "Create a new table"
3. Table name: `newsletter_subscribers`
4. Add columns:
   - **id** (default, primary key)
   - **email** (type: text, unique: yes)
   - **created_at** (default, timestamp)
5. Click "Save"

### Contact Form Submissions Table

1. Create another table: `contact_submissions`
2. Add columns:
   - **id** (default, primary key)
   - **name** (type: text)
   - **email** (type: text)
   - **subject** (type: text)
   - **message** (type: text)
   - **created_at** (default, timestamp)
3. Click "Save"

### Booking Requests Table

1. Create another table: `booking_requests`
2. Add columns:
   - **id** (default, primary key)
   - **name** (type: text)
   - **email** (type: text)
   - **phone** (type: text)
   - **service** (type: text)
   - **date** (type: text)
   - **message** (type: text)
   - **status** (type: text, default: 'pending')
   - **created_at** (default, timestamp)
3. Click "Save"

## Step 5: Configure Row Level Security (RLS)

### Enable RLS for Newsletter Table

1. Go to **Authentication** → **Policies**
2. Select `newsletter_subscribers` table
3. Click "Enable RLS"
4. Create a new policy:
   - **Policy Name:** "Public insert"
   - **Allowed operation:** INSERT
   - **Target role:** anon
   - **Policy definition:** `true`
5. Click "Save"

### Enable RLS for Contact Submissions Table

1. Select `contact_submissions` table
2. Click "Enable RLS"
3. Create a new policy:
   - **Policy Name:** "Public insert"
   - **Allowed operation:** INSERT
   - **Target role:** anon
   - **Policy definition:** `true`
4. Click "Save"

### Enable RLS for Booking Requests Table

1. Select `booking_requests` table
2. Click "Enable RLS"
3. Create a new policy:
   - **Policy Name:** "Public insert"
   - **Allowed operation:** INSERT
   - **Target role:** anon
   - **Policy definition:** `true`
4. Click "Save"

## Step 6: Deploy Changes

1. Commit the updated `js/supabase-config.js` file
2. Push to GitHub
3. Vercel will automatically redeploy

## Step 7: Test the Newsletter Form

1. Visit your website: https://icthubs.com
2. Scroll to the bottom CTA section
3. Enter your email in the newsletter form
4. Click "Subscribe"
5. Check for success message
6. Verify in Supabase Table Editor that the email was added

## Step 8: Next Steps (Contact & Booking Forms)

After testing the newsletter form, we can integrate Supabase into:
- **Contact form** (contact.html)
- **Booking form** (booking.html)

These will follow the same pattern as the newsletter integration.

## Important Notes

- **Security:** Never commit your Supabase service_role key to Git. Only use the anon key for client-side operations.
- **RLS:** Row Level Security allows public inserts while keeping your data secure.
- **Environment Variables:** For production, consider using environment variables instead of hardcoding credentials.

## Troubleshooting

**Form shows "Service not configured":**
- Check that you replaced the placeholder values in `js/supabase-config.js`
- Verify your Supabase project URL and anon key are correct

**Subscription fails:**
- Check browser console for errors
- Verify RLS policies are enabled and configured correctly
- Ensure the table exists in Supabase

**Email already subscribed error:**
- This is expected behavior - the email field is set to unique
- The form will show an appropriate message to users
