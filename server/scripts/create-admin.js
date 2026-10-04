require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
// Usage: npm run create-admin -- admin@example.com StrongPassword123
// (command-line values win; ADMIN_EMAIL in .env is only the *notification* mailbox, so it is NOT used as the login unless you pass nothing.)
(async () => {
  if (!process.env.MONGODB_URI) { console.error('Add MONGODB_URI to .env first'); process.exit(1); }
  const email = String(process.argv[2] || process.env.ADMIN_LOGIN_EMAIL || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Tinkerleaf Admin';
  if (!email || !password) { console.error('Usage: npm run create-admin -- admin@example.com StrongPassword123'); process.exit(1); }
  if (password.length < 10) { console.error('Use an admin password of at least 10 characters.'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate({ email }, { name, email, passwordHash, role: 'admin', emailVerified: true }, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log('Admin account ready:', email);
  await mongoose.disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });
