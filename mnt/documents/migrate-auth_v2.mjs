import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

/**
 * Supabase Auth Migration Script
 * 
 * This script imports auth-users.json into a new Supabase project using the Admin API.
 * Requirements:
 * - Read SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env
 * - Preserve UUIDs, email verification status, and metadata
 * - Skip duplicate users
 */

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateAuth() {
  const filePath = './auth-users.json';
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${filePath} not found.`);
    return;
  }

  try {
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Starting migration for ${users.length} users...`);

    for (const user of users) {
      console.log(`Checking user: ${user.email} (${user.id})`);

      // 1. Check if user already exists
      const { data: existing, error: fetchError } = await supabase.auth.admin.getUserById(user.id);
      
      if (existing?.user) {
        console.log(`Skipping: User ${user.email} already exists.`);
        continue;
      }

      // 2. Create user in the new project
      // Note: password hashes are typically not migratable via admin.createUser 
      // without specific enterprise features or direct DB access. 
      // We use a dummy password or require a reset if hashes weren't exported.
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        email_confirm: !!user.email_confirmed_at,
        user_metadata: user.raw_user_meta_data || {},
        app_metadata: user.raw_app_meta_data || {},
        password: 'TemporaryMigrationPassword123!' // Placeholder
      });

      if (createError) {
        console.error(`Failed to create ${user.email}:`, createError.message);
      } else {
        console.log(`Successfully migrated: ${user.email}`);
      }
    }

    console.log('Migration process finished.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

migrateAuth();
