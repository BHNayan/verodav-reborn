import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

/**
 * Supabase Auth Migration Script
 * 
 * This script reads auth-users.json and imports users into a new Supabase project
 * using the Admin API (auth.admin.createUser).
 */

const NEW_PROJECT_URL = process.env.SUPABASE_URL; // Target project URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Target project Service Role Key

if (!NEW_PROJECT_URL || !SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.');
  process.exit(1);
}

const supabase = createClient(NEW_PROJECT_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateUsers() {
  try {
    const data = JSON.parse(fs.readFileSync('./auth-users.json', 'utf8'));
    console.log(`Found ${data.length} users in auth-users.json`);

    for (const user of data) {
      console.log(`Processing user: ${user.email} (${user.id})`);

      // Check if user already exists to prevent duplicates
      const { data: existingUser, error: getError } = await supabase.auth.admin.getUserById(user.id);
      
      if (existingUser?.user) {
        console.log(`User ${user.email} already exists. Skipping.`);
        continue;
      }

      // Create user with preserved UUID and metadata
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        email_confirm: !!user.email_confirmed_at,
        password: 'TemporaryPassword123!', // Note: Hashes cannot be directly imported via createUser
        user_metadata: user.raw_user_meta_data || {},
        app_metadata: user.raw_app_meta_data || {}
      });

      if (createError) {
        console.error(`Error creating user ${user.email}:`, createError.message);
      } else {
        console.log(`Successfully migrated user: ${user.email}`);
      }
    }

    console.log('Migration complete.');
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

migrateUsers();
