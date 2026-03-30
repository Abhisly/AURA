import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:SkillgapAura@db.gkugyghzjnhaapycdgho.supabase.co:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  console.log('Connecting to database to setup tables...');
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        skill_data JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Users table successfully created or already exists.');
  } catch (err) {
    console.error('❌ Error setting up database:', err);
  } finally {
    pool.end();
  }
}

setupDatabase();
