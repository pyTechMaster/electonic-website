const jwt = require('jsonwebtoken');
const User = require('../models/User');
function sign(user) { return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' }); }
function cookieOpts() { return { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' }; }
function setAuthCookie(res, token) { res.cookie('tl_token', token, Object.assign(cookieOpts(), { maxAge: 7*24*60*60*1000 })); }
function clearAuthCookie(res) { res.clearCookie('tl_token', cookieOpts()); }
async function optionalAuth(req, res, next) {
  try { const token = req.cookies.tl_token; if (token) { const p = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(p.id).select('-passwordHash'); } } catch (_) {}
  next();
}
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.tl_token;
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const p = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(p.id).select('-passwordHash');
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (_) { return res.status(401).json({ error: 'Invalid or expired session' }); }
}
function requireAdmin(req, res, next) { if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' }); next(); }
module.exports = { sign, setAuthCookie, clearAuthCookie, optionalAuth, requireAuth, requireAdmin };
