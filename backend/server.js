import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const app = express();

app.use(cors());
app.use(express.json());

const supabaseUrl = 'https://gkugyghzjnhaapycdgho.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_mGBTm5SVxHCoDhUOTG87Vg_jOx5xh_X';
const supabase = createClient(supabaseUrl, supabaseKey);

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const { data: existing, error: existErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);
      
    if (existErr) throw existErr;
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: result, error: insertErr } = await supabase
      .from('users')
      .insert([{ full_name: fullName, email, password_hash: hashedPassword, skill_data: {} }])
      .select('id, full_name, email, skill_data');

    if (insertErr) throw insertErr;

    res.json({ user: result[0] });
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
    const { data: existing, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', identifier);
      
    if (error) throw error;
    if (!existing || existing.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const user = existing[0];
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
    const { data: result, error } = await supabase
      .from('users')
      .update({ skill_data })
      .eq('email', email)
      .select('id, skill_data');

    if (error) throw error;
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true, user: result[0] });
  } catch (error) {
    console.error('Backup Sync Error:', error);
    res.status(500).json({ error: error.message || 'Database error during backup sync.' });
  }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  });
}

export default app;
