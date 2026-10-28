# Student Directory - React + Tailwind CSS + Supabase

Companion demo for the BSIT Teaching Demo slides.

## Setup
1. Create a Supabase project, open **SQL Editor**, paste and run `supabase-setup.sql`.
   The script can be rerun if `public.students` already exists; it won't duplicate
   the sample rows.
2. Copy `.env.example` to `.env` and fill in your Project URL and anon/publishable key
   (Project Settings -> API). Never use the `service_role` key.
3. Install and run:
   ```
   npm install
   npm run dev
   ```
   Open http://localhost:5173
4. Restart `npm run dev` any time you edit `.env`.

## Enable deleting students
If you created the `students` table before adding delete support, run this policy
in **Supabase -> SQL Editor**:
```sql
drop policy if exists "Anyone can delete students (demo)" on public.students;

create policy "Anyone can delete students (demo)"
  on public.students for delete
  to anon
  using (true);
```
This is for classroom demos only: anyone with access to the app can delete any
student record. Remove the policy to disable public deletes.

## Slide -> file map
| Slide | Where |
|---|---|
| 7 Create the table | `supabase-setup.sql` |
| 8 Connect React | `.env.example`, `package.json` |
| 9 Read data | `src/supabaseClient.js`, `loadStudents()` in `src/App.jsx` |
| 10 Tailwind | the card markup in `src/App.jsx` |
| 11 Security | RLS + policies in `supabase-setup.sql` |
