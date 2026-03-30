import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Pool } = pg;
const app = express();

app.use(cors());
app.use(express.json());

// Direct connection string to Supabase postgres
const pool = new Pool({
  connectionString: 'postgresql://postgres:SkillgapAura@db.gkugyghzjnhaapycdgho.supabase.co:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('✅ Connected to Supabase PostgreSQL Database successfully.');
  release();
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, skill_data) 
       VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, skill_data`,
      [fullName, email, hashedPassword, JSON.stringify({})]
    );

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message || 'Database error during registration.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [identifier]);
    if (existing.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const user = existing.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    
    if (!match) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    res.json({ 
      user: { 
        id: user.id, 
        full_name: user.full_name, 
        email: user.email, 
        skill_data: user.skill_data 
      } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: error.message || 'Database error during login.' });
  }
});

// POST /api/users/backup
app.post('/api/users/backup', async (req, res) => {
  const { email, skill_data } = req.body;
  if (!email || !skill_data) {
    return res.status(400).json({ error: 'Missing sync data.' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET skill_data = $1 WHERE email = $2 RETURNING id, skill_data',
      [JSON.stringify(skill_data), email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Backup Sync Error:', error);
    res.status(500).json({ error: 'Database error during backup sync.' });
  }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  });
}

export default app;
