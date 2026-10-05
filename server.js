require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const Order = require('./server/models/Order');
const Product = require('./server/models/Product');
const Cart = require('./server/models/Cart');
const Review = require('./server/models/Review');
const Coupon = require('./server/models/Coupon');
const PaymentAttempt = require('./server/models/PaymentAttempt');
const WebhookEvent = require('./server/models/WebhookEvent');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { sign, setAuthCookie, clearAuthCookie, optionalAuth, requireAuth, requireAdmin } = require('./server/middleware/auth');

const IS_PROD = process.env.NODE_ENV === 'production';
// ---- Startup safety checks -------------------------------------------------
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || /change-this/i.test(process.env.JWT_SECRET)) {
  if (IS_PROD) { console.error('FATAL: set a long random JWT_SECRET (32+ chars) in the environment before running in production.'); process.exit(1); }
  console.warn('WARNING: JWT_SECRET is missing/weak. Using a temporary random secret (everyone is logged out on each restart). Set a real one in .env.');
  process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
}
process.on('unhandledRejection', e => console.error('Unhandled rejection:', e && e.message ? e.message : e));


const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }) : null;
const mailer = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS ? nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 465), secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
}) : null;
async function sendMail(to, subject, text, html){
  if(!mailer || !to) return false;
  try { await mailer.sendMail({from:process.env.MAIL_FROM || process.env.SMTP_USER,to,subject,text,html}); return true; }
  catch(e){ console.error('Email send failed:', e.message); return false; }
}

// Records when a customer last signed in (shown to the admin in the Users tab).
function touchLogin(id){ User.updateOne({ _id:id }, { $set:{ lastLoginAt:new Date() }, $inc:{ loginCount:1 } }).catch(()=>{}); }
// Set REQUIRE_EMAIL_VERIFICATION=false if you do not use SMTP: new accounts are then active immediately after sign-up.
const REQUIRE_EMAIL_VERIFICATION = String(process.env.REQUIRE_EMAIL_VERIFICATION || 'true').toLowerCase() !== 'false';
function newOrderId(){ return 'TL' + Date.now().toString(36).toUpperCase().slice(-5) + crypto.randomBytes(3).toString('hex').toUpperCase(); }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GSTIN_RE = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const str = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const sleep = ms => new Promise(r => setTimeout(r, ms));
function tokenHash(token){ return crypto.createHash('sha256').update(String(token)).digest('hex'); }
function makeToken(){ return crypto.randomBytes(32).toString('hex'); }
function appUrl(){ return String(process.env.CLIENT_ORIGIN || `http://localhost:${PORT}`).replace(/\/$/,''); }
function cleanPin(pin){ return String(pin||'').trim(); }
function isServiceablePin(pin){
  pin=cleanPin(pin);
  if(!/^\d{6}$/.test(pin)) return false;
  const mode=String(process.env.DELIVERY_MODE||'all_india').toLowerCase();
  if(mode==='all_india') return true;
  const pins=String(process.env.DELIVERY_PINCODES||'').split(',').map(x=>x.trim()).filter(Boolean);
  const prefixes=String(process.env.DELIVERY_PIN_PREFIXES||'').split(',').map(x=>x.trim()).filter(Boolean);
  return pins.includes(pin) || prefixes.some(p=>pin.startsWith(p));
}
function gstBreakup(total){
  const rate=Math.max(0,Number(process.env.GST_RATE||0));
  if(!rate) return {rate:0,taxable:Number(total)||0,gst:0,cgst:0,sgst:0};
  const gross=Number(total)||0;
  const taxable=String(process.env.GST_INCLUDED||'true').toLowerCase()==='true' ? gross/(1+rate/100) : gross;
  const gst=String(process.env.GST_INCLUDED||'true').toLowerCase()==='true' ? gross-taxable : taxable*rate/100;
  return {rate,taxable,gst,cgst:gst/2,sgst:gst/2};
}
function orderEmailHtml(o){
  const rows=o.items.map(i=>`<tr><td>${String(i.name).replace(/[<>&]/g,'')}</td><td>${i.quantity}</td><td>₹${Number(i.price).toLocaleString('en-IN')}</td></tr>`).join('');
  return `<div style="font-family:Arial,sans-serif;max-width:650px;margin:auto"><h2 style="color:#1f5c3f">🍃 Tinkerleaf — Order ${o.orderId}</h2><p>Thank you, ${String(o.customer.name).replace(/[<>&]/g,'')}.</p><p><b>Status:</b> ${o.status}${(o.courier||o.trackingNumber)?`<br><b>Courier:</b> ${String(o.courier||'-').replace(/[<>&]/g,'')} &nbsp; <b>Tracking no.:</b> ${String(o.trackingNumber||'-').replace(/[<>&]/g,'')}`:''}<br><b>Payment:</b> ${o.paymentMethod} / ${o.paymentStatus}</p><table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;width:100%"><tr><th>Product</th><th>Qty</th><th>Price</th></tr>${rows}</table><p><b>Subtotal:</b> ₹${o.subtotal.toLocaleString('en-IN')}<br>${o.discount>0?`<b>Coupon${o.couponCode?' ('+String(o.couponCode).replace(/[<>&]/g,'')+')':''}:</b> -₹${o.discount.toLocaleString('en-IN')}<br>`:''}<b>Delivery:</b> ${o.delivery?`₹${o.delivery.toLocaleString('en-IN')}`:'FREE'}<br><b>Total:</b> ₹${o.total.toLocaleString('en-IN')}</p><p><b>Delivery:</b> ${String(o.customer.address).replace(/[<>&]/g,'')}, ${String(o.customer.city).replace(/[<>&]/g,'')} - ${String(o.customer.pin).replace(/[<>&]/g,'')}</p></div>`;
}

const app = express();
const PORT = Number(process.env.PORT || 3000);
// Behind Render/Railway/Heroku/Nginx set TRUST_PROXY=1 so rate limits use the real visitor IP.
if (process.env.TRUST_PROXY) app.set('trust proxy', /^\d+$/.test(process.env.TRUST_PROXY) ? Number(process.env.TRUST_PROXY) : process.env.TRUST_PROXY);
app.use(helmet({ contentSecurityPolicy: false }));
// Razorpay webhook must receive the raw request body for signature verification.
app.post('/api/webhooks/razorpay', express.raw({ type: 'application/json', limit: '256kb' }), async (req,res)=>{
  try {
    const secret=String(process.env.RAZORPAY_WEBHOOK_SECRET||'');
    if(!secret) return res.status(503).send('Webhook secret is not configured');
    if(!Buffer.isBuffer(req.body)) return res.status(400).send('Invalid body');
    const signature=String(req.headers['x-razorpay-signature']||'');
    const expected=crypto.createHmac('sha256',secret).update(req.body).digest('hex');
    if(!signature || expected.length!==signature.length || !crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(signature))) return res.status(400).send('Invalid webhook signature');
    let payload; try { payload=JSON.parse(req.body.toString('utf8')); } catch (_) { return res.status(400).send('Invalid JSON'); }
    const eventId=String(req.headers['x-razorpay-event-id']||payload.id||crypto.createHash('sha256').update(req.body).digest('hex'));
    if(await WebhookEvent.exists({eventId})) return res.json({ok:true,duplicate:true});
    const payment=payload.payload?.payment?.entity;
    if(payment?.id && payment.order_id){
      const status=String(payment.status||'').toLowerCase();
      const set={webhookStatus:status,webhookEvent:payload.event||'unknown',lastWebhookAt:new Date()};
      // Never overwrite a payment id that the verify step already stored for a *different* payment.
      await PaymentAttempt.updateOne({razorpayOrderId:String(payment.order_id),$or:[{paymentId:null},{paymentId:String(payment.id)}]},{$set:Object.assign({paymentId:String(payment.id)},set)});
    }
    // Record the event only AFTER it was processed, so a failure returns 500 and Razorpay retries it.
    await WebhookEvent.create({eventId,event:payload.event||'unknown',receivedAt:new Date()}).catch(e=>{ if(e?.code!==11000) throw e; });
    res.json({ok:true});
  } catch(e){ console.error('Razorpay webhook error:',e.message); res.status(500).send('Webhook processing failed'); }
});
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { index: false, maxAge: IS_PROD ? '1h' : 0, setHeaders: (res, fp) => {
  // The service worker and manifest must always be re-checked, otherwise app updates reach customers very late.
  if (/[\\/](sw\.js|site\.webmanifest)$/.test(fp)) res.setHeader('Cache-Control', 'no-cache');
} }));
app.get('/', (req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.get('/admin.html', (req,res)=>res.sendFile(path.join(__dirname,'public','admin.html')));

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});
const sensitiveAuthRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' }
});

const couponRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many coupon attempts. Please try again in a few minutes.' }
});

const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many sign-up attempts. Please try again later.' }
});

app.get('/api/health', (req,res)=>res.json({ ok:true, service:'Tinkerleaf API', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

app.post('/api/auth/register', registerRateLimit, async (req,res)=>{
  try {
    const name = str(req.body.name, 100), cleanEmail = str(req.body.email, 254).toLowerCase(), password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!name || !cleanEmail || !password) return res.status(400).json({ error:'Name, email and password are required' });
    if (!EMAIL_RE.test(cleanEmail)) return res.status(400).json({ error:'Please enter a valid email address' });
    if (password.length < 6) return res.status(400).json({ error:'Password must be at least 6 characters' });
    if (password.length > 72) return res.status(400).json({ error:'Password must be at most 72 characters' });
    if (await User.exists({ email: cleanEmail })) return res.status(409).json({ error:'An account with this email already exists' });
    // Local development without SMTP: nobody could ever verify the email, so verify automatically (never in production).
    if ((!mailer && !IS_PROD) || !REQUIRE_EMAIL_VERIFICATION) {
      const u = await User.create({ name, email:cleanEmail, passwordHash:await bcrypt.hash(password,12), emailVerified:true, lastLoginAt:new Date(), loginCount:1 });
      setAuthCookie(res, sign(u));
      if (!REQUIRE_EMAIL_VERIFICATION) console.log('Account '+cleanEmail+' created (email verification is switched off).'); else console.warn('DEV: SMTP not configured, account '+cleanEmail+' was auto-verified.');
      return res.status(201).json({ user:{ id:u._id, name:u.name, email:u.email, role:u.role, emailVerified:true } });
    }
    const verifyToken=makeToken();
    const user = await User.create({
      name, email:cleanEmail, passwordHash:await bcrypt.hash(password,12),
      emailVerified:false,
      emailVerificationTokenHash:tokenHash(verifyToken),
      emailVerificationExpiresAt:new Date(Date.now()+Number(process.env.EMAIL_VERIFICATION_HOURS||24)*60*60*1000)
    });
    const verifyUrl=appUrl()+'/api/auth/verify-email?token='+encodeURIComponent(verifyToken)+'&email='+encodeURIComponent(cleanEmail);
    const sent=await sendMail(cleanEmail,'Verify your Tinkerleaf email',
      `Hi ${user.name}, verify your Tinkerleaf account here: ${verifyUrl}`,
      `<div style="font-family:Arial,sans-serif;max-width:650px;margin:auto"><h2 style="color:#1f5c3f">🍃 Verify your Tinkerleaf email</h2><p>Hi ${String(user.name).replace(/[<>&]/g,'')}, please verify your email to activate your account.</p><p><a href="${verifyUrl}" style="display:inline-block;background:#1f5c3f;color:white;padding:12px 18px;border-radius:8px;text-decoration:none">Verify email</a></p><p>This link expires in ${Number(process.env.EMAIL_VERIFICATION_HOURS||24)} hours.</p></div>`);
    if(!sent) return res.status(201).json({pendingVerification:true, message:'Account created. Configure SMTP to receive the verification email.', user:{ id:user._id, name:user.name, email:user.email, role:user.role, emailVerified:false }});
    res.status(201).json({pendingVerification:true, message:'Account created. Check your email to verify your account.', user:{ id:user._id, name:user.name, email:user.email, role:user.role, emailVerified:false }});
  } catch(e){ res.status(500).json({ error:'Could not create account' }); }
});

app.post('/api/auth/login', authRateLimit, async (req,res)=>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email:String(email||'').trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(String(password||''), user.passwordHash))) return res.status(401).json({ error:'Email or password is incorrect' });
    if(user.emailVerified===false) return res.status(403).json({ error:'Please verify your email before signing in.', code:'EMAIL_NOT_VERIFIED' });
    setAuthCookie(res, sign(user));
    touchLogin(user._id);
    res.json({ user:{ id:user._id, name:user.name, email:user.email, role:user.role, emailVerified:user.emailVerified!==false } });
  } catch(e){ res.status(500).json({ error:'Could not sign in' }); }
});

app.get('/api/auth/verify-email', async(req,res)=>{
  try{
    const email=String(req.query.email||'').trim().toLowerCase(), token=String(req.query.token||'');
    const u=await User.findOne({email,emailVerificationTokenHash:tokenHash(token),emailVerificationExpiresAt:{$gt:new Date()}});
    if(!u) return res.status(400).send('<h2>Verification link is invalid or expired.</h2><p>Please request a new verification email from Tinkerleaf.</p>');
    u.emailVerified=true; u.emailVerificationTokenHash=null; u.emailVerificationExpiresAt=null; await u.save();
    setAuthCookie(res,sign(u)); touchLogin(u._id);
    res.send('<h2>Tinkerleaf email verified ✅</h2><p>Your account is verified. You can return to the store.</p><script>setTimeout(()=>location.href="/",1200)</script>');
  }catch(e){res.status(500).send('<h2>Could not verify email.</h2>');}
});
app.post('/api/auth/resend-verification', sensitiveAuthRateLimit, async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim().toLowerCase(), u=await User.findOne({email});
    if(!u) return res.json({ok:true,message:'If the account exists, a verification email will be sent.'});
    if(u.emailVerified!==false) return res.json({ok:true,message:'Email is already verified.'});
    const token=makeToken(); u.emailVerificationTokenHash=tokenHash(token); u.emailVerificationExpiresAt=new Date(Date.now()+Number(process.env.EMAIL_VERIFICATION_HOURS||24)*60*60*1000); await u.save();
    const url=appUrl()+'/api/auth/verify-email?token='+encodeURIComponent(token)+'&email='+encodeURIComponent(email);
    await sendMail(email,'Verify your Tinkerleaf email again',`Verify your Tinkerleaf account: ${url}`,`<p>Please verify your Tinkerleaf account:</p><p><a href="${url}">${url}</a></p>`);
    res.json({ok:true,message:'If SMTP is configured, a new verification email has been sent.'});
  }catch(e){res.status(500).json({error:'Could not resend verification email'});}
});
app.post('/api/auth/forgot-password', sensitiveAuthRateLimit, async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim().toLowerCase(), u=await User.findOne({email});
    const generic={ok:true,message:'If an account exists for this email, password reset instructions have been sent.'};
    if(!u) return res.json(generic);
    const token=makeToken(); u.passwordResetTokenHash=tokenHash(token); u.passwordResetExpiresAt=new Date(Date.now()+Number(process.env.PASSWORD_RESET_MINUTES||30)*60*1000); await u.save();
    const url=appUrl()+'/?reset='+encodeURIComponent(token)+'&email='+encodeURIComponent(email);
    await sendMail(email,'Reset your Tinkerleaf password',`Reset your password using this link: ${url}`,`<div style="font-family:Arial"><h2>Reset your Tinkerleaf password</h2><p><a href="${url}">Reset password</a></p><p>This link expires in ${Number(process.env.PASSWORD_RESET_MINUTES||30)} minutes.</p></div>`);
    res.json(generic);
  }catch(e){res.status(500).json({error:'Could not start password reset'});}
});
app.post('/api/auth/reset-password', sensitiveAuthRateLimit, async(req,res)=>{
  try{
    const email=String(req.body.email||'').trim().toLowerCase(), token=String(req.body.token||''), password=String(req.body.password||'');
    if(password.length<6) return res.status(400).json({error:'Password must be at least 6 characters'});
    if(password.length>72) return res.status(400).json({error:'Password must be at most 72 characters'});
    const u=await User.findOne({email,passwordResetTokenHash:tokenHash(token),passwordResetExpiresAt:{$gt:new Date()}});
    if(!u) return res.status(400).json({error:'Reset link is invalid or expired'});
    u.passwordHash=await bcrypt.hash(password,12); u.passwordResetTokenHash=null; u.passwordResetExpiresAt=null; await u.save();
    res.json({ok:true,message:'Password reset successfully. You can sign in now.'});
  }catch(e){res.status(500).json({error:'Could not reset password'});}
});

app.get('/api/auth/me', optionalAuth, (req,res)=>res.json({ user:req.user||null }));
app.post('/api/auth/logout', (req,res)=>{ clearAuthCookie(res); res.json({ ok:true }); });

app.get('/api/products', async (req,res)=>{ try { res.json(await Product.find().sort({createdAt:-1})); } catch(e){ res.status(500).json({error:'Could not load products'}); } });
// Units sold per product name (cancelled orders ignored), cached for 5 minutes. Used by the shop's "Popular" sort.
let popCache={at:0,data:{}};
app.get('/api/products/popularity', async (req,res)=>{ try {
  if(Date.now()-popCache.at>300000){
    const rows=await Order.aggregate([{$match:{status:{$ne:'cancelled'}}},{$unwind:'$items'},{$group:{_id:'$items.name',qty:{$sum:'$items.quantity'}}}]);
    const d={}; rows.forEach(r=>{ if(r._id) d[r._id]=r.qty; }); popCache={at:Date.now(),data:d};
  }
  res.json(popCache.data);
} catch(e){ res.status(500).json({error:'Could not load popularity'}); } });
app.get('/api/products/:id', async (req,res)=>{ try { const p=await Product.findById(req.params.id); if(!p)return res.status(404).json({error:'Product not found'}); res.json(p); } catch(e){ res.status(400).json({error:'Invalid product id'}); } });
function pickProduct(b){
  const out={}; b=b||{};
  for(const k of ['name','brand','category','image','description']) if(b[k]!==undefined) out[k]=str(b[k], k==='description'?2000:300);
  for(const k of ['price','originalPrice','stock']) if(b[k]!==undefined && b[k]!==null && b[k]!==''){ const n=Number(b[k]); if(!Number.isFinite(n)||n<0) throw new Error(k+' must be a non-negative number'); out[k]=k==='stock'?Math.floor(n):n; }
  return out;
}
app.post('/api/products', requireAuth, requireAdmin, async (req,res)=>{ try { res.status(201).json(await Product.create(pickProduct(req.body))); } catch(e){ res.status(400).json({error:'Could not create product',details:e.message}); } });
app.put('/api/products/:id', requireAuth, requireAdmin, async (req,res)=>{ try { const p=await Product.findByIdAndUpdate(req.params.id,{$set:pickProduct(req.body)},{new:true,runValidators:true}); if(!p)return res.status(404).json({error:'Product not found'}); res.json(p); } catch(e){ res.status(400).json({error:'Could not update product'}); } });
app.delete('/api/products/:id', requireAuth, requireAdmin, async (req,res)=>{ try { await Product.findByIdAndDelete(req.params.id); res.json({ok:true}); } catch(e){ res.status(400).json({error:'Could not delete product'}); } });

app.get('/api/cart', requireAuth, async (req,res)=>{
  const c=await Cart.findOne({userId:req.user._id});
  res.json({items:c?.items||[]});
});
app.put('/api/cart', requireAuth, async (req,res)=>{
  try {
    const items=Array.isArray(req.body.items)?req.body.items:[];
    const clean=items.map(x=>({name:String(x.name||'').trim(),quantity:Math.max(1,Math.min(9999,Number(x.quantity)||1))})).filter(x=>x.name);
    const valid=await Product.find({name:{$in:clean.map(x=>x.name)}}).select('name stock');
    const stock=new Map(valid.map(x=>[x.name,x.stock]));
    for(const x of clean){ if(!stock.has(x.name)) return res.status(400).json({error:'Product not found: '+x.name}); if(x.quantity>stock.get(x.name)) return res.status(409).json({error:'Only '+stock.get(x.name)+' left for '+x.name}); }
    const c=await Cart.findOneAndUpdate({userId:req.user._id},{userId:req.user._id,items:clean},{new:true,upsert:true,setDefaultsOnInsert:true});
    res.json({items:c.items});
  } catch(e){res.status(400).json({error:'Could not save cart',details:e.message});}
});
app.delete('/api/cart', requireAuth, async (req,res)=>{ await Cart.findOneAndUpdate({userId:req.user._id},{items:[]},{upsert:true}); res.json({ok:true}); });

app.get('/api/addresses', requireAuth, async(req,res)=>{ const u=await User.findById(req.user._id).select('addresses'); res.json(u.addresses||[]); });
app.post('/api/addresses', requireAuth, async(req,res)=>{
  try{
    const a=req.body||{};
    if(!a.name||!a.phone||!a.address||!a.city||!/^[0-9]{6}$/.test(String(a.pin||''))) return res.status(400).json({error:'Complete address details are required'});
    const u=await User.findById(req.user._id);
    u.addresses=u.addresses||[];
    const item={label:String(a.label||'Home').trim().slice(0,40),name:String(a.name).trim(),phone:String(a.phone).trim(),address:String(a.address).trim(),city:String(a.city).trim(),pin:String(a.pin).trim()};
    u.addresses.push(item); await u.save(); res.status(201).json(item);
  }catch(e){res.status(400).json({error:'Could not save address'});}
});
app.delete('/api/addresses/:index', requireAuth, async(req,res)=>{ const i=Number(req.params.index); const u=await User.findById(req.user._id); if(!Number.isInteger(i)||i<0||i>=(u.addresses||[]).length)return res.status(404).json({error:'Address not found'}); u.addresses.splice(i,1); await u.save(); res.json({ok:true}); });


app.get('/api/payments/razorpay/config', (req,res)=>res.json({enabled:!!razorpay,keyId:process.env.RAZORPAY_KEY_ID||null}));
// ---- Coupons ---------------------------------------------------------------
const COUPON_CODE_RE = /^[A-Z0-9][A-Z0-9_-]{2,19}$/;
function cleanCouponCode(v){ return String(v==null?'':v).trim().toUpperCase().slice(0,30); }
function couponDiscount(c, subtotal){
  let d = c.type==='percent' ? Math.floor(subtotal*c.value/100) : Math.floor(c.value);
  if(c.type==='percent' && c.maxDiscount>0) d=Math.min(d,c.maxDiscount);
  return Math.max(0, Math.min(d, subtotal));
}
// Checks a coupon against a cart subtotal. Throws an Error with a customer-friendly message when it cannot be used.
async function checkCoupon(code, userId, subtotal){
  const fail=m=>{ const e=new Error(m); e.coupon=true; return e; };
  code=cleanCouponCode(code);
  if(!code) throw fail('Enter a coupon code.');
  const c=await Coupon.findOne({code});
  if(!c || !c.active) throw fail('This coupon code is not valid.');
  const now=new Date();
  if(c.startsAt && now<c.startsAt) throw fail('This coupon is not active yet.');
  if(c.expiresAt && now>c.expiresAt) throw fail('This coupon has expired.');
  if(c.usageLimit>0 && c.usedCount>=c.usageLimit) throw fail('This coupon has reached its usage limit.');
  if(c.minOrder>0 && subtotal<c.minOrder) throw fail('This coupon needs a cart of at least ₹'+c.minOrder.toLocaleString('en-IN')+'.');
  if(c.perUserLimit>0){
    const used=await Order.countDocuments({userId,couponCode:c.code,status:{$ne:'cancelled'}});
    if(used>=c.perUserLimit) throw fail(c.perUserLimit===1?'You have already used this coupon.':'You have already used this coupon the maximum number of times.');
  }
  const discount=couponDiscount(c,subtotal);
  if(discount<=0) throw fail('This coupon gives no discount on your cart.');
  return {coupon:c,discount};
}

// Prices always come from the database, never from the browser. A coupon (optional) is re-checked here every time.
// lenient=true: a bad coupon does not throw, it is reported in couponError and the cart is priced without it.
async function getServerCartTotal(userId, couponCode, lenient){
  const c=await Cart.findOne({userId});
  const cartItems=Array.isArray(c?.items)?c.items:[];
  if(!cartItems.length) throw new Error('Your server cart is empty. Please refresh your cart and try again.');
  const products=await Product.find({name:{$in:cartItems.map(i=>i.name)}}).select('name price stock');
  if(products.length!==cartItems.length) throw new Error('One or more cart products are no longer available.');
  const byName=new Map(products.map(p=>[p.name,p]));
  const items=cartItems.map(i=>({name:i.name,quantity:Number(i.quantity),price:Number(byName.get(i.name).price)}));
  if(items.some(i=>!Number.isInteger(i.quantity)||i.quantity<1)) throw new Error('Invalid cart quantity.');
  const subtotal=items.reduce((sum,i)=>sum+i.price*i.quantity,0);
  const delivery=subtotal>=1000?0:60; // free-delivery rule uses the amount BEFORE the coupon
  let discount=0, coupon=null, couponError='';
  if(cleanCouponCode(couponCode)){
    try{ const r=await checkCoupon(couponCode,userId,subtotal); discount=r.discount; coupon=r.coupon; }
    catch(e){ if(!e.coupon||!lenient) throw e; couponError=e.message; }
  }
  return {items,subtotal,delivery,discount,coupon,couponCode:coupon?coupon.code:'',couponError,total:subtotal-discount+delivery};
}

async function refundPayment(paymentId, amountPaise){
  if(!razorpay || !paymentId) return null;
  try { return (await razorpay.payments.refund(paymentId, {amount:amountPaise})) || {}; }
  catch(e){ console.error('Razorpay refund failed:', e.message); return null; }
}

app.post('/api/coupons/validate', requireAuth, couponRateLimit, async (req,res)=>{
  try{
    const cart=await getServerCartTotal(req.user._id, req.body?.code);
    res.json({ok:true,code:cart.couponCode,description:cart.coupon.description||'',type:cart.coupon.type,value:cart.coupon.value,subtotal:cart.subtotal,discount:cart.discount,delivery:cart.delivery,total:cart.total});
  }catch(e){ res.status(400).json({error:e.message||'Could not apply coupon'}); }
});
app.post('/api/payments/razorpay/order', requireAuth, async (req,res)=>{
  try{
    if(!razorpay) return res.status(503).json({error:'Online payment is not configured. Add Razorpay keys to .env.'});
    const idempotencyKey=String(req.body.idempotencyKey||req.headers['x-idempotency-key']||'').trim();
    if(!idempotencyKey || idempotencyKey.length<16 || idempotencyKey.length>100) return res.status(400).json({error:'A valid payment idempotency key is required'});
    const cart=await getServerCartTotal(req.user._id, req.body.couponCode);
    const amount=Math.round(cart.total*100);
    if(!Number.isInteger(amount)||amount<100) return res.status(400).json({error:'Invalid server-calculated payment amount'});
    const existing=await PaymentAttempt.findOne({idempotencyKey,userId:req.user._id});
    if(existing){
      if(Number(existing.amountPaise)!==amount) return res.status(409).json({error:'This payment attempt no longer matches the current cart total. Please start checkout again.'});
      return res.json({id:existing.razorpayOrderId,amount:existing.amountPaise,currency:existing.currency,keyId:process.env.RAZORPAY_KEY_ID,idempotencyKey});
    }
    const rp=await razorpay.orders.create({amount,currency:'INR',receipt:String(req.body.receipt||('TL'+Date.now())).slice(0,40),notes:{userId:String(req.user._id),serverTotal:String(cart.total),coupon:cart.couponCode||'',idempotencyKey}});
    await PaymentAttempt.create({idempotencyKey,userId:req.user._id,razorpayOrderId:rp.id,amountPaise:rp.amount,currency:rp.currency,status:'created'});
    res.json({id:rp.id,amount:rp.amount,currency:rp.currency,keyId:process.env.RAZORPAY_KEY_ID,idempotencyKey});
  }catch(e){
    if(e?.code===11000){
      const key=String(req.body.idempotencyKey||'').trim(); const existing=await PaymentAttempt.findOne({idempotencyKey:key,userId:req.user._id});
      if(existing) return res.json({id:existing.razorpayOrderId,amount:existing.amountPaise,currency:existing.currency,keyId:process.env.RAZORPAY_KEY_ID,idempotencyKey:key});
    }
    res.status(400).json({error:e.message||'Could not create Razorpay order'});
  }
});
app.post('/api/payments/razorpay/verify', requireAuth, async (req,res)=>{
  try{
    if(!razorpay || !process.env.RAZORPAY_KEY_SECRET) return res.status(503).json({error:'Razorpay is not configured'});
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature,idempotencyKey}=req.body;
    if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature) return res.status(400).json({error:'Payment verification details are incomplete'});
    const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+'|'+razorpay_payment_id).digest('hex');
    const supplied=String(razorpay_signature);
    if(expected.length!==supplied.length || !crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(supplied))) return res.status(400).json({error:'Payment verification failed'});
    const rpOrder=await razorpay.orders.fetch(razorpay_order_id);
    if(!rpOrder || String(rpOrder.notes?.userId||'')!==String(req.user._id)) return res.status(403).json({error:'Payment does not belong to this account'});
    const cart=await getServerCartTotal(req.user._id, req.body.couponCode, true);
    const expectedAmount=Math.round(cart.total*100);
    if(Number(rpOrder.amount)!==expectedAmount) {
      await refundPayment(razorpay_payment_id, Number(rpOrder.amount));
      return res.status(409).json({error:(cart.couponError?'Coupon problem: '+cart.couponError+' ':'')+'Payment amount does not match the current server cart. The payment has been sent for refund.'});
    }
    let payment=await razorpay.payments.fetch(razorpay_payment_id);
    for(let i=0;i<3 && payment && String(payment.status||'').toLowerCase()==='authorized';i++){ await sleep(1500); payment=await razorpay.payments.fetch(razorpay_payment_id); }
    if(!payment || String(payment.order_id)!==String(razorpay_order_id)) return res.status(400).json({error:'Payment/order mismatch'});
    if(Number(payment.amount)!==expectedAmount) { await refundPayment(razorpay_payment_id,Number(payment.amount)); return res.status(409).json({error:'The Razorpay payment amount does not match the server total. The payment has been sent for refund.'}); }
    if(String(payment.status||'').toLowerCase()!=='captured') return res.status(409).json({error:'Razorpay has not confirmed this payment yet.'});
    const existing=await Order.exists({paymentId:String(razorpay_payment_id)});
    if(existing) return res.status(409).json({error:'This payment has already been used for an order'});
    const attempt=await PaymentAttempt.findOneAndUpdate({razorpayOrderId:String(razorpay_order_id),userId:req.user._id},{$set:{paymentId:String(razorpay_payment_id),status:String(payment.status||'').toLowerCase(),verifiedAt:new Date()}},{new:true});
    if(!attempt) return res.status(400).json({error:'Payment attempt could not be matched to this account'});
    res.json({verified:true,paymentId:razorpay_payment_id,razorpayOrderId:razorpay_order_id,signature:razorpay_signature,amount:Number(payment.amount),status:payment.status,idempotencyKey:attempt.idempotencyKey});
  }catch(e){res.status(400).json({error:e.message||'Payment verification failed'});}
});

app.get('/api/delivery/check/:pin', (req,res)=>{
  const pin=cleanPin(req.params.pin);
  if(!/^\d{6}$/.test(pin)) return res.status(400).json({serviceable:false,error:'Enter a valid 6-digit Indian pincode.'});
  const serviceable=isServiceablePin(pin);
  res.json({serviceable,pin,mode:String(process.env.DELIVERY_MODE||'all_india').toLowerCase(),message:serviceable?'Delivery is available to this pincode.':'Sorry, delivery is not currently available to this pincode.'});
});

const orderBrief=o=>({ok:true,orderId:o.orderId,status:o.status,items:o.items,subtotal:o.subtotal,delivery:o.delivery,discount:o.discount||0,couponCode:o.couponCode||'',total:o.total,paymentStatus:o.paymentStatus,duplicate:true});
app.post('/api/orders', requireAuth, async (req,res)=>{
  let paymentId='', paymentMethod='cod', cart=null;
  const b=req.body||{};
  const key=str(b.idempotencyKey,100);
  try {
    if(key){ const prior=await Order.findOne({userId:req.user._id,idempotencyKey:key}); if(prior) return res.json(orderBrief(prior)); }
    const c=b.customer||{};
    const customer={name:str(c.name,100),phone:str(c.phone,20),email:str(c.email,254).toLowerCase(),address:str(c.address,300),city:str(c.city,80),pin:str(c.pin,6),business:str(c.business,150),gstin:str(c.gstin,15).toUpperCase()};
    if(!customer.name || !customer.phone || !customer.address || !customer.city || !customer.pin) return res.status(400).json({error:'Delivery details are incomplete'});
    if(!/^[0-9+\s-]{10,15}$/.test(customer.phone)) return res.status(400).json({error:'Enter a valid phone number'});
    if(customer.email && !EMAIL_RE.test(customer.email)) return res.status(400).json({error:'Enter a valid email address'});
    if(customer.gstin && !GSTIN_RE.test(customer.gstin)) return res.status(400).json({error:'Enter a valid 15-character GSTIN'});
    if(!isServiceablePin(customer.pin)) return res.status(422).json({error:'Delivery is not available to this pincode'});
    // A retry for a payment that already produced this user's order (cart is empty by now) just returns that order.
    if(b.paymentMethod==='online' && b.paymentId){ const mine=await Order.findOne({paymentId:String(b.paymentId),userId:req.user._id}); if(mine) return res.json(orderBrief(mine)); }
    paymentMethod=b.paymentMethod==='online'?'online':'cod';
    // A bad coupon on an ONLINE order must not throw here: the customer may already have paid the discounted amount,
    // so it falls through to the amount check below, which refunds the payment.
    cart=await getServerCartTotal(req.user._id, b.couponCode, true);
    if(cart.couponError && paymentMethod!=='online') return res.status(409).json({error:cart.couponError});
    let paymentStatus='pending', razorpayOrderId='', razorpaySignature='';
    if(paymentMethod==='online'){
      if(!razorpay) return res.status(503).json({error:'Online payment is not configured'});
      if(!b.razorpayOrderId||!b.paymentId||!b.razorpaySignature) return res.status(400).json({error:'A verified Razorpay payment is required'});
      const rzOrderId=String(b.razorpayOrderId), rzPaymentId=String(b.paymentId);
      const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(rzOrderId+'|'+rzPaymentId).digest('hex');
      const supplied=String(b.razorpaySignature);
      if(expected.length!==supplied.length || !crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(supplied))) return res.status(400).json({error:'Payment verification failed'});
      // The same payment already has an order (e.g. the first response was lost): return that order instead of failing.
      const used=await Order.findOne({paymentId:rzPaymentId});
      if(used) return String(used.userId)===String(req.user._id) ? res.json(orderBrief(used)) : res.status(409).json({error:'This payment has already been used for an order'});
      const rpOrder=await razorpay.orders.fetch(rzOrderId);
      const expectedAmount=Math.round(cart.total*100);
      const payment=await razorpay.payments.fetch(rzPaymentId);
      const payStatus=String(payment.status||'').toLowerCase();
      const ownPayment=String(rpOrder.notes?.userId||'')===String(req.user._id) && String(payment.order_id)===rzOrderId;
      if(!ownPayment) return res.status(403).json({error:'Payment does not belong to this account'});
      if(Number(rpOrder.amount)!==expectedAmount || Number(payment.amount)!==expectedAmount || payStatus!=='captured'){
        if(payStatus==='captured' && Number(payment.amount)>0) await refundPayment(rzPaymentId, Number(payment.amount));
        return res.status(409).json({error:(cart.couponError?'Coupon problem: '+cart.couponError+' ':'')+'Payment could not be matched to your current cart. Any captured payment has been sent for refund.'});
      }
      paymentStatus='paid'; paymentId=rzPaymentId; razorpayOrderId=rzOrderId; razorpaySignature=supplied;
    }
    const doc={userId:req.user._id,items:cart.items,subtotal:cart.subtotal,delivery:cart.delivery,discount:cart.discount,couponCode:cart.couponCode,total:cart.total,customer,paymentMethod,paymentStatus,status:'placed',statusHistory:[{status:'placed',note:'Order placed',at:new Date()}]};
    if(key) doc.idempotencyKey=key;
    if(paymentMethod==='online'){ doc.paymentId=paymentId; doc.razorpayOrderId=razorpayOrderId; doc.razorpaySignature=razorpaySignature; }
    // Reserve stock atomically (stock >= qty), then create the order. Anything that fails here is rolled back.
    const changed=[]; let order=null, couponReserved=null;
    try {
      // Reserve one use of the coupon atomically (so a usage limit can never be exceeded by two buyers at once).
      if(cart.coupon){
        // Add 1 first, then check the limit: two buyers racing for the last use can never both get it.
        const got=await Coupon.findOneAndUpdate({_id:cart.coupon._id,active:true},{$inc:{usedCount:1}},{new:true});
        if(got) couponReserved=got;
        if(!got || (got.usageLimit>0 && got.usedCount>got.usageLimit)){
          const e=new Error('This coupon has just reached its usage limit or was switched off.'); e.status=409; throw e;
        }
      }
      for(const i of cart.items){
        const p=await Product.findOneAndUpdate({name:i.name,stock:{$gte:i.quantity}},{$inc:{stock:-i.quantity}},{new:true});
        if(!p) { const e=new Error('Not enough stock for '+i.name); e.status=409; throw e; }
        changed.push(i);
      }
      for(let n=0;n<4 && !order;n++){
        try { order=await Order.create(Object.assign({orderId:newOrderId()},doc)); }
        catch(e){ if(e?.code===11000 && e.keyPattern && e.keyPattern.orderId) continue; throw e; }
      }
      if(!order) throw new Error('Could not allocate an order number. Please try again.');
    } catch(err) {
      for(const r of changed) await Product.updateOne({name:r.name},{$inc:{stock:r.quantity}}).catch(()=>{});
      if(couponReserved) await Coupon.updateOne({_id:couponReserved._id,usedCount:{$gt:0}},{$inc:{usedCount:-1}}).catch(()=>{});
      if(err?.code===11000){
        // Two identical requests raced (double click). The other one owns the payment/order, so do NOT refund.
        const or=[]; if(key) or.push({idempotencyKey:key}); if(paymentId) or.push({paymentId});
        const winner=or.length ? await Order.findOne({userId:req.user._id,$or:or}) : null;
        if(winner) return res.json(orderBrief(winner));
      }
      if(paymentMethod==='online' && paymentId && !(await Order.exists({paymentId}))) {
        const r=await refundPayment(paymentId, Math.round(cart.total*100));
        if(r) await PaymentAttempt.updateOne({razorpayOrderId},{$set:{refundedAt:new Date(),refundId:String(r.id||'')}}).catch(()=>{});
      }
      return res.status(err.status||409).json({error:(err.message||'Could not save order')+(paymentMethod==='online'?' Any online payment has been sent for refund.':'')});
    }
    // From here the order exists. Nothing below is allowed to undo it.
    if(paymentMethod==='online') await PaymentAttempt.updateOne({razorpayOrderId},{$set:{orderCreated:true}}).catch(()=>{});
    await Cart.findOneAndUpdate({userId:req.user._id},{items:[]},{upsert:true}).catch(()=>{});
    if(order.customer.email) sendMail(order.customer.email,`Tinkerleaf order ${order.orderId} confirmed`,`Your Tinkerleaf order ${order.orderId} for ₹${order.total} has been placed. Current status: ${order.status}.`,orderEmailHtml(order));
    if(process.env.ADMIN_EMAIL) sendMail(process.env.ADMIN_EMAIL,`New Tinkerleaf order ${order.orderId} — ₹${order.total}`,`New order ${order.orderId} from ${order.customer.name}. Total ₹${order.total}.`,orderEmailHtml(order));
    return res.status(201).json({ok:true,orderId:order.orderId,status:order.status,items:order.items,subtotal:order.subtotal,delivery:order.delivery,discount:order.discount||0,couponCode:order.couponCode||'',total:order.total,paymentStatus:order.paymentStatus});
  } catch(e){ console.error('Order error:',e.message); res.status(400).json({error:e.message||'Could not save order'}); }
});
app.get('/api/orders/my', requireAuth, async (req,res)=>{ res.json(await Order.find({userId:req.user._id}).select('-razorpaySignature').sort({createdAt:-1})); });
app.get('/api/orders/:orderId/invoice', requireAuth, async(req,res)=>{
  try{
    const o=await Order.findOne({orderId:req.params.orderId,userId:req.user._id}).select('-razorpaySignature');
    if(!o) return res.status(404).json({error:'Order not found'});
    const doc=new PDFDocument({margin:45,size:'A4'});
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition',`attachment; filename="Tinkerleaf-Invoice-${o.orderId}.pdf"`);
    doc.pipe(res);
    const gst=gstBreakup(o.total);
    const money=n=>'Rs. '+Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}); // built-in PDF fonts cannot draw the rupee sign
    doc.fontSize(22).fillColor('#1f5c3f').text('TINKERLEAF');
    doc.fillColor('#222').fontSize(10).text(String(process.env.BUSINESS_ADDRESS||'Ahmedabad, Gujarat, India'));
    if(process.env.BUSINESS_GSTIN) doc.text('GSTIN: '+process.env.BUSINESS_GSTIN);
    doc.moveDown(1);
    doc.fontSize(17).text('TAX INVOICE / BILL',{align:'right'}).fontSize(10).text('Invoice / Order No.: '+o.orderId,{align:'right'}).text('Date: '+new Date(o.createdAt).toLocaleDateString('en-IN'),{align:'right'});
    doc.moveDown();
    doc.fontSize(11).text('Bill To',{underline:true});
    doc.fontSize(10).text(o.customer?.name||'-').text(o.customer?.address||'-').text(`${o.customer?.city||'-'} - ${o.customer?.pin||'-'}`).text('Phone: '+(o.customer?.phone||'-')).text('Email: '+(o.customer?.email||'-'));
    if(o.customer?.business) doc.text('Business / Institution: '+o.customer.business);
    if(o.customer?.gstin) doc.text('GSTIN: '+o.customer.gstin);
    doc.moveDown();
    const startY=doc.y;
    doc.font('Helvetica-Bold').text('Item',45,startY,{width:280}).text('Qty',330,startY,{width:45}).text('Rate',375,startY,{width:70}).text('Amount',450,startY,{width:100,align:'right'});
    doc.moveTo(45,startY+16).lineTo(550,startY+16).stroke();
    let y=startY+25; doc.font('Helvetica');
    (o.items||[]).forEach(i=>{
      doc.text(String(i.name||'-'),45,y,{width:280}); doc.text(String(i.quantity||0),330,y,{width:45});
      doc.text(money(i.price),375,y,{width:70}); doc.text(money(Number(i.price||0)*Number(i.quantity||0)),450,y,{width:100,align:'right'}); y+=20;
      if(y>720){doc.addPage();y=50;}
    });
    doc.moveTo(350,y+5).lineTo(550,y+5).stroke(); y+=18;
    doc.font('Helvetica').text('Subtotal',350,y,{width:100}).text(money(o.subtotal),450,y,{width:100,align:'right'}); y+=18;
    if(o.discount>0){ doc.text('Coupon'+(o.couponCode?' ('+o.couponCode+')':''),350,y,{width:100}).text('- '+money(o.discount),450,y,{width:100,align:'right'}); y+=18; }
    doc.text('Delivery',350,y,{width:100}).text(money(o.delivery),450,y,{width:100,align:'right'}); y+=18;
    if(gst.rate){
      doc.text(`Taxable value (${gst.rate}% included)`,350,y,{width:100}).text(money(gst.taxable),450,y,{width:100,align:'right'}); y+=18;
      doc.text(`CGST ${gst.rate/2}%`,350,y,{width:100}).text(money(gst.cgst),450,y,{width:100,align:'right'}); y+=18;
      doc.text(`SGST ${gst.rate/2}%`,350,y,{width:100}).text(money(gst.sgst),450,y,{width:100,align:'right'}); y+=18;
    }
    doc.font('Helvetica-Bold').fontSize(12).text('Grand Total',350,y,{width:100}).text(money(o.total),450,y,{width:100,align:'right'});
    y+=35; doc.font('Helvetica').fontSize(9).text('Payment: '+(o.paymentMethod==='online'?'Online / Razorpay':'Cash on Delivery')+' | Payment status: '+o.paymentStatus);
    if(gst.rate) doc.text(`GST rate used for this invoice: ${gst.rate}% (${String(process.env.GST_INCLUDED||'true').toLowerCase()==='true'?'tax included in listed prices':'tax added separately'}).`);
    doc.moveDown(1).fontSize(9).text('Thank you for shopping with Tinkerleaf. This invoice is generated electronically.');
    doc.end();
  }catch(e){console.error(e);if(!res.headersSent)res.status(500).json({error:'Could not generate invoice'});}
});

app.get('/api/orders/:orderId', requireAuth, async (req,res)=>{ const o=await Order.findOne({orderId:req.params.orderId,userId:req.user._id}).select('-razorpaySignature'); if(!o)return res.status(404).json({error:'Order not found'}); res.json(o); });

// Atomically moves an order to 'cancelled' (so stock is restored exactly once), then refunds paid online orders.
async function cancelOrderCore(order, allowed, note, extraSet){
  const claimed=await Order.findOneAndUpdate(
    {_id:order._id,status:{$in:allowed}},
    {$set:Object.assign({status:'cancelled'},extraSet||{}),$push:{statusHistory:{status:'cancelled',note,at:new Date()}}},
    {new:true});
  if(!claimed) return null;
  for(const i of claimed.items||[]){ if(i.name && Number.isInteger(i.quantity) && i.quantity>0) await Product.updateOne({name:i.name},{$inc:{stock:i.quantity}}); }
  if(claimed.couponCode) await Coupon.updateOne({code:claimed.couponCode,usedCount:{$gt:0}},{$inc:{usedCount:-1}}).catch(()=>{}); // cancelled order frees the coupon use
  if(claimed.paymentMethod==='online' && claimed.paymentStatus==='paid' && claimed.paymentId){
    const amountPaise=Math.round(Number(claimed.total)*100);
    const r=await refundPayment(claimed.paymentId, amountPaise);
    if(r){
      claimed.paymentStatus='refunded'; claimed.refund={status:'done',refundId:String(r.id||''),amountPaise,at:new Date()};
      claimed.statusHistory.push({status:'cancelled',note:'Refund of ₹'+(amountPaise/100)+' started to the original payment method',at:new Date()});
    } else {
      claimed.refund={status:'failed',amountPaise,at:new Date(),error:'Automatic refund failed. Refund manually from the Razorpay Dashboard.'};
      claimed.statusHistory.push({status:'cancelled',note:'Automatic refund FAILED - needs manual refund in Razorpay',at:new Date()});
    }
    await claimed.save();
  }
  return claimed;
}
app.patch('/api/orders/:orderId/cancel', requireAuth, async (req,res)=>{
  try{
    const reason=str(req.body?.reason||'Customer requested cancellation',500);
    const o=await Order.findOne({orderId:req.params.orderId,userId:req.user._id});
    if(!o) return res.status(404).json({error:'Order not found'});
    const c=await cancelOrderCore(o,['placed','confirmed','packed'],'Cancelled by customer: '+reason,{cancelRequest:{requested:true,reason,requestedAt:new Date()}});
    if(!c) return res.status(409).json({error:'This order can no longer be cancelled because it has already been dispatched or cancelled.'});
    if(c.customer?.email) sendMail(c.customer.email,`Tinkerleaf order ${c.orderId} cancelled`,`Your order ${c.orderId} has been cancelled. ${c.paymentStatus==='refunded'?'Your refund has been started and usually reaches you in 5-7 working days.':(c.refund?.status==='failed'?'We will process your refund manually.':'')}`,orderEmailHtml(c));
    res.json({ok:true,message:c.paymentStatus==='refunded'?'Order cancelled. Your refund has been started.':'Order cancelled successfully.',order:c});
  }catch(e){ console.error(e); res.status(500).json({error:'Could not cancel order'}); }
});

app.post('/api/orders/:orderId/return-request', requireAuth, async (req,res)=>{
  try{
    const reason=String(req.body?.reason||'').trim().slice(0,500);
    if(reason.length<5) return res.status(400).json({error:'Please provide a return reason.'});
    const o=await Order.findOne({orderId:req.params.orderId,userId:req.user._id});
    if(!o) return res.status(404).json({error:'Order not found'});
    if(o.status!=='delivered') return res.status(409).json({error:'Return requests are available only for delivered orders.'});
    if(o.returnRequest?.requested) return res.status(409).json({error:'A return request already exists for this order.'});
    const deliveredEvent=(o.statusHistory||[]).filter(x=>x.status==='delivered').slice(-1)[0];
    const deliveredAt=deliveredEvent?.at || o.updatedAt || o.createdAt;
    if(Date.now()-new Date(deliveredAt).getTime() > 7*24*60*60*1000) return res.status(409).json({error:'The 7-day return window has expired.'});
    o.returnRequest={requested:true,reason,items:(o.items||[]).map(i=>i.name),requestedAt:new Date(),status:'requested'};
    await o.save();
    if(o.customer?.email) sendMail(o.customer.email,`Tinkerleaf return request received — ${o.orderId}`,`We received your return request for ${o.orderId}. Reason: ${reason}`,orderEmailHtml(o));
    if(process.env.ADMIN_EMAIL) sendMail(process.env.ADMIN_EMAIL,`Return request — ${o.orderId}`,`Customer ${o.customer?.name||''} requested a return. Reason: ${reason}`,orderEmailHtml(o));
    res.status(201).json({ok:true,message:'Return request submitted successfully.',order:o});
  }catch(e){ console.error(e); res.status(500).json({error:'Could not submit return request'}); }
});

app.patch('/api/admin/orders/:orderId/return-request', requireAuth, requireAdmin, async(req,res)=>{
  try{
    const status=String(req.body.status||'').trim();
    if(!['approved','rejected','refunded'].includes(status)) return res.status(400).json({error:'Invalid return request status'});
    const o=await Order.findOne({orderId:req.params.orderId});
    if(!o)return res.status(404).json({error:'Order not found'});
    if(!o.returnRequest?.requested)return res.status(409).json({error:'No return request exists'});
    if(['refunded','rejected'].includes(o.returnRequest.status)) return res.status(409).json({error:'This return request is already '+o.returnRequest.status+'.'});
    let extra='';
    if(status==='refunded' && o.paymentMethod==='online' && o.paymentStatus==='paid' && o.paymentId && o.refund?.status!=='done'){
      const amountPaise=Math.round(Number(o.total)*100);
      const r=await refundPayment(o.paymentId, amountPaise);
      if(!r) return res.status(502).json({error:'Razorpay refund failed. Check the payment in the Razorpay Dashboard, then try again.'});
      o.paymentStatus='refunded'; o.refund={status:'done',refundId:String(r.id||''),amountPaise,at:new Date()}; extra=' Refund started to the original payment method.';
    } else if(status==='refunded') extra=' (Cash on Delivery order: refund this amount to the customer manually.)';
    o.returnRequest.status=status;
    o.returnRequest.note=str(req.body.note,500);
    o.statusHistory=o.statusHistory||[]; o.statusHistory.push({status:o.status,note:'Return request '+status+extra,at:new Date()});
    await o.save();
    if(o.customer?.email) sendMail(o.customer.email,`Tinkerleaf return request ${o.orderId} — ${status}`,`Your return request for ${o.orderId} is ${status}. ${o.returnRequest.note||''}`,orderEmailHtml(o));
    res.json(o);
  }catch(e){console.error(e);res.status(500).json({error:'Could not update return request'});}
});

app.get('/api/admin/orders', requireAuth, requireAdmin, async (req,res)=>{ res.json(await Order.find().select('-razorpaySignature').sort({createdAt:-1}).limit(1000)); });
const ORDER_FLOW=['placed','confirmed','packed','shipped','delivered'];
app.patch('/api/admin/orders/:orderId/status', requireAuth, requireAdmin, async (req,res)=>{
  try{
    const target=String(req.body.status||'');
    if(![...ORDER_FLOW,'cancelled'].includes(target)) return res.status(400).json({error:'Invalid status'});
    const o=await Order.findOne({orderId:req.params.orderId});
    if(!o) return res.status(404).json({error:'Order not found'});
    if(o.status==='cancelled') return res.status(409).json({error:'A cancelled order cannot be changed.'});
    if(o.status==='delivered' && target!=='delivered') return res.status(409).json({error:'A delivered order cannot be changed. Use the return request flow.'});
    if(target==='cancelled'){
      const c=await cancelOrderCore(o,['placed','confirmed','packed','shipped'],'Cancelled by admin');
      if(!c) return res.status(409).json({error:'Order could not be cancelled (its status changed). Refresh and try again.'});
      if(c.customer?.email) sendMail(c.customer.email,`Tinkerleaf order ${c.orderId} cancelled`,`Your order ${c.orderId} has been cancelled.${c.paymentStatus==='refunded'?' Your refund has been started.':''}`,orderEmailHtml(c));
      return res.json(c);
    }
    if(ORDER_FLOW.indexOf(target)<ORDER_FLOW.indexOf(o.status)) return res.status(409).json({error:'An order cannot be moved backwards.'});
    const changed=o.status!==target;
    const courier=str(req.body.courier,60), trackingNumber=str(req.body.trackingNumber,60);
    if(courier) o.courier=courier; if(trackingNumber) o.trackingNumber=trackingNumber;
    o.status=target;
    // Cash on Delivery is collected at the door, so mark it paid once delivered (keeps revenue figures right).
    if(target==='delivered' && o.paymentMethod==='cod' && o.paymentStatus==='pending') o.paymentStatus='paid';
    o.statusHistory=o.statusHistory||[];
    if(changed) o.statusHistory.push({status:target,note:'Status updated by admin',at:new Date()});
    await o.save();
    if(changed && o.customer?.email) sendMail(o.customer.email,`Tinkerleaf order ${o.orderId} — ${o.status}`,`Your Tinkerleaf order ${o.orderId} is now ${o.status}.`,orderEmailHtml(o));
    res.json(o);
  }catch(e){ console.error(e); res.status(500).json({error:'Could not update order'}); }
});

// ---- Admin: coupons ----------------------------------------------------------
function parseCouponBody(b, forCreate){
  const out={}, err=m=>{ const e=new Error(m); e.status=400; return e; };
  const num=(v,min,max,label)=>{ const n=Number(v); if(!Number.isFinite(n)||n<min||n>max) throw err(label+' is not valid.'); return n; };
  const date=(v,label)=>{ if(v===''||v==null) return null; const d=new Date(v); if(isNaN(d)) throw err(label+' is not a valid date.'); return d; };
  if(forCreate){
    const code=cleanCouponCode(b.code);
    if(!COUPON_CODE_RE.test(code)) throw err('Coupon code must be 3-20 characters: letters, numbers, - or _.');
    out.code=code;
  }
  if(forCreate || b.type!==undefined){ if(!['percent','flat'].includes(b.type)) throw err('Choose percent or flat discount.'); out.type=b.type; }
  if(forCreate || b.value!==undefined){ out.value=num(b.value,1,1e7,'Discount value'); }
  const type=out.type||b.type;
  if(out.value!==undefined && type==='percent' && out.value>100) throw err('Percent discount cannot be more than 100.');
  if(out.value!==undefined && type==='flat') out.value=Math.floor(out.value);
  if(b.description!==undefined) out.description=str(b.description,200);
  if(b.maxDiscount!==undefined) out.maxDiscount=Math.floor(num(b.maxDiscount||0,0,1e7,'Max discount'));
  if(b.minOrder!==undefined) out.minOrder=Math.floor(num(b.minOrder||0,0,1e7,'Minimum order'));
  if(b.usageLimit!==undefined) out.usageLimit=Math.floor(num(b.usageLimit||0,0,1e7,'Usage limit'));
  if(b.perUserLimit!==undefined) out.perUserLimit=Math.floor(num(b.perUserLimit||0,0,1e4,'Per-customer limit'));
  if(b.startsAt!==undefined) out.startsAt=date(b.startsAt,'Start date');
  if(b.expiresAt!==undefined) out.expiresAt=date(b.expiresAt,'Expiry date');
  if(out.startsAt && out.expiresAt && out.expiresAt<=out.startsAt) throw err('Expiry must be after the start date.');
  if(b.active!==undefined) out.active=!!b.active;
  return out;
}
app.get('/api/admin/coupons', requireAuth, requireAdmin, async(req,res)=>{ res.json(await Coupon.find().sort({createdAt:-1}).limit(500)); });
app.post('/api/admin/coupons', requireAuth, requireAdmin, async(req,res)=>{
  try{ res.status(201).json(await Coupon.create(parseCouponBody(req.body||{},true))); }
  catch(e){
    if(e?.code===11000) return res.status(409).json({error:'A coupon with this code already exists.'});
    res.status(e.status||400).json({error:e.message||'Could not create coupon'});
  }
});
// Edit a coupon, or switch it on / off ({active:true|false}). The code itself cannot be changed.
app.patch('/api/admin/coupons/:id', requireAuth, requireAdmin, async(req,res)=>{
  try{
    const c=await Coupon.findById(req.params.id); if(!c) return res.status(404).json({error:'Coupon not found'});
    const upd=parseCouponBody(Object.assign({type:c.type},req.body||{}),false); delete upd.code;
    if(upd.value!==undefined && c.type==='percent' && upd.value>100) throw Object.assign(new Error('Percent discount cannot be more than 100.'),{status:400});
    Object.assign(c,upd); await c.save(); res.json(c);
  }catch(e){ res.status(e.status||400).json({error:e.message||'Could not update coupon'}); }
});
app.delete('/api/admin/coupons/:id', requireAuth, requireAdmin, async(req,res)=>{
  try{ const r=await Coupon.findByIdAndDelete(req.params.id); if(!r) return res.status(404).json({error:'Coupon not found'}); res.json({ok:true}); }
  catch(e){ res.status(400).json({error:'Could not delete coupon'}); }
});

app.get('/api/wishlist', requireAuth, async(req,res)=>{ const u=await User.findById(req.user._id); res.json(u.wishlist||[]); });
app.post('/api/wishlist', requireAuth, async(req,res)=>{ const name=String(req.body.name||'').trim(); if(!name)return res.status(400).json({error:'Product name required'}); await User.findByIdAndUpdate(req.user._id,{$addToSet:{wishlist:name}}); res.json({ok:true}); });
app.delete('/api/wishlist/:name', requireAuth, async(req,res)=>{ await User.findByIdAndUpdate(req.user._id,{$pull:{wishlist:req.params.name}}); res.json({ok:true}); });


app.get('/api/reviews', async(req,res)=>{
  const name=String(req.query.product||'').trim(); if(!name)return res.status(400).json({error:'Product name required'});
  const reviews=await Review.find({productName:name}).sort({createdAt:-1}).limit(50);
  const agg=await Review.aggregate([{$match:{productName:name}},{$group:{_id:null,avg:{$avg:'$rating'},count:{$sum:1}}}]);
  const dist={}; (await Review.aggregate([{$match:{productName:name}},{$group:{_id:'$rating',c:{$sum:1}}}])).forEach(r=>{dist[r._id]=r.c;});
  res.json({reviews,summary:{average:agg[0]?.avg||0,count:agg[0]?.count||0},distribution:dist});
});
app.post('/api/reviews', requireAuth, async(req,res)=>{
  try{
    const productName=String(req.body.productName||'').trim(), rating=Number(req.body.rating), text=String(req.body.text||'').trim();
    if(!productName||!Number.isInteger(rating)||rating<1||rating>5||text.length<3) return res.status(400).json({error:'Product, 1–5 rating and review text are required'});
    const delivered=await Order.exists({userId:req.user._id,status:'delivered','items.name':productName});
    if(!delivered) return res.status(403).json({error:'Only customers who received this product can review it.'});
    const r=await Review.findOneAndUpdate({productName,userId:req.user._id},{productName,userId:req.user._id,userName:req.user.name,rating,text,verifiedPurchase:true},{new:true,upsert:true,setDefaultsOnInsert:true,runValidators:true});
    res.status(201).json(r);
  }catch(e){res.status(400).json({error:'Could not save review'});}
});

app.get('/api/admin/stats', requireAuth, requireAdmin, async(req,res)=>{
  const [users,orders,products,pending,lowStock,outOfStock,paidAgg]=await Promise.all([
    User.countDocuments({role:'customer'}), Order.countDocuments(), Product.countDocuments(),
    Order.countDocuments({status:{$in:['placed','confirmed','packed','shipped']}}),
    Product.countDocuments({stock:{$gt:0,$lte:10}}), Product.countDocuments({stock:0}),
    Order.aggregate([{$match:{paymentStatus:'paid'}},{$group:{_id:null,total:{$sum:'$total'},count:{$sum:1}}}])
  ]);
  const w=signupWindows();
  const [verifiedUsers,usersToday,users7d,users30d]=await Promise.all([
    User.countDocuments({role:'customer',emailVerified:{$ne:false}}),
    User.countDocuments({role:'customer',createdAt:{$gte:w.today}}),
    User.countDocuments({role:'customer',createdAt:{$gte:w.d7}}),
    User.countDocuments({role:'customer',createdAt:{$gte:w.d30}})
  ]);
  res.json({users,verifiedUsers,usersToday,users7d,users30d,orders,products,pending,lowStock,outOfStock,revenue:paidAgg[0]?.total||0,paidOrders:paidAgg[0]?.count||0});
});

// "Today" is counted in Indian time (IST), whatever time zone the server runs in.
function signupWindows(){
  const now=Date.now(), IST=5.5*3600*1000, DAY=86400000;
  return { today:new Date(Math.floor((now+IST)/DAY)*DAY-IST), d7:new Date(now-7*DAY), d30:new Date(now-30*DAY) };
}
async function orderCountsByUser(ids){
  const match=ids?{userId:{$in:ids}}:{userId:{$ne:null}};
  const rows=await Order.aggregate([{$match:match},{$group:{_id:'$userId',n:{$sum:1}}}]);
  return new Map(rows.map(r=>[String(r._id),r.n]));
}

// Registered users: who signed up, when, and when they last signed in.
app.get('/api/admin/users', requireAuth, requireAdmin, async(req,res)=>{
  try{
    const limit=Math.min(Math.max(parseInt(req.query.limit,10)||100,1),500), skip=Math.max(parseInt(req.query.skip,10)||0,0);
    const q=str(req.query.q,100), filter={role:'customer'};
    if(q){ const rx=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'); filter.$or=[{name:rx},{email:rx}]; }
    const [users,total]=await Promise.all([
      User.find(filter).select('name email emailVerified createdAt lastLoginAt loginCount').sort({createdAt:-1}).skip(skip).limit(limit).lean(),
      User.countDocuments(filter)
    ]);
    const counts=await orderCountsByUser(users.map(u=>u._id));
    res.json({ total, users:users.map(u=>({ id:u._id, name:u.name, email:u.email, verified:u.emailVerified!==false, createdAt:u.createdAt, lastLoginAt:u.lastLoginAt||null, loginCount:u.loginCount||0, orders:counts.get(String(u._id))||0 })) });
  }catch(e){ res.status(500).json({ error:'Could not load users' }); }
});
app.get('/api/admin/users.csv', requireAuth, requireAdmin, async(req,res)=>{
  try{
    const users=await User.find({role:'customer'}).select('name email emailVerified createdAt lastLoginAt loginCount').sort({createdAt:-1}).limit(50000).lean();
    const counts=await orderCountsByUser(null);
    // Cells starting with = + - @ would be run as formulas by Excel, so they get a leading apostrophe.
    const cell=v=>{ let t=String(v==null?'':v); if(/^[=+\-@\t\r]/.test(t)) t="'"+t; return '"'+t.replace(/"/g,'""')+'"'; };
    const ist=d=>d?new Date(d).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}):'';
    const lines=[['Name','Email','Email verified','Joined (IST)','Last login (IST)','Logins','Orders'].map(cell).join(',')];
    users.forEach(u=>lines.push([u.name,u.email,u.emailVerified!==false?'Yes':'No',ist(u.createdAt),ist(u.lastLoginAt),u.loginCount||0,counts.get(String(u._id))||0].map(cell).join(',')));
    res.set('Content-Type','text/csv; charset=utf-8');
    res.set('Content-Disposition','attachment; filename="tinkerleaf-users-'+new Date().toISOString().slice(0,10)+'.csv"');
    res.send('\ufeff'+lines.join('\r\n'));
  }catch(e){ res.status(500).json({ error:'Could not export users' }); }
});

// Unknown /api paths must return JSON, never the website HTML.
app.use('/api', (req,res)=>res.status(404).json({error:'Not found'}));
app.get('/{*splat}', (req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
// Malformed JSON / unexpected errors -> JSON instead of an HTML stack page.
app.use((err,req,res,next)=>{
  if(res.headersSent) return next(err);
  if(err && err.type==='entity.parse.failed') return res.status(400).json({error:'Invalid JSON in request'});
  if(err && err.type==='entity.too.large') return res.status(413).json({error:'Request too large'});
  console.error('Unhandled error:',err && err.message ? err.message : err);
  res.status(500).json({error:'Something went wrong'});
});

// Money safety net: a customer paid (Razorpay says captured) but the browser closed / network dropped before the order was saved.
// After a grace period such orphan payments are refunded automatically so nobody is charged for nothing.
async function reconcileOrphanPayments(){
  if(!razorpay || mongoose.connection.readyState!==1) return;
  const graceMs=Math.max(Number(process.env.ORPHAN_REFUND_AFTER_MINUTES||30),process.env.NODE_ENV==='test'?0:5)*60*1000;
  const stale=await PaymentAttempt.find({
    orderCreated:{$ne:true}, refundedAt:null, paymentId:{$ne:null},
    $or:[{status:'captured'},{webhookStatus:'captured'}],
    updatedAt:{$lt:new Date(Date.now()-graceMs)}
  }).limit(25);
  for(const a of stale){
    try{
      if(await Order.exists({$or:[{paymentId:a.paymentId},{razorpayOrderId:a.razorpayOrderId}]})){ a.orderCreated=true; await a.save(); continue; }
      const pay=await razorpay.payments.fetch(a.paymentId);
      if(String(pay.status).toLowerCase()!=='captured' || Number(pay.amount_refunded||0)>0){ a.refundedAt=a.refundedAt||new Date(); a.refundError='Skipped: payment status is '+pay.status; await a.save(); continue; }
      const r=await refundPayment(a.paymentId, Number(pay.amount));
      if(r){ a.refundedAt=new Date(); a.refundId=String(r.id||''); a.refundError=null; console.log('Auto-refunded orphan payment',a.paymentId); }
      else a.refundError='Refund failed at '+new Date().toISOString();
      await a.save();
    }catch(e){ console.error('Reconcile error for',a.paymentId,e.message); }
  }
}

async function start(){
  if(!process.env.MONGODB_URI){
    console.warn('MONGODB_URI is missing. Copy .env.example to .env and add your MongoDB URI.');
    if(IS_PROD){ console.error('FATAL: MONGODB_URI is required in production.'); process.exit(1); }
  } else {
    try {
      await mongoose.connect(process.env.MONGODB_URI); console.log('MongoDB connected');
      // One-time clean-up + index repair (safe to run on every start).
      await Order.collection.updateMany({paymentId:''},{$unset:{paymentId:1}});
      await Order.syncIndexes();
    } catch(e){
      console.error('MongoDB connection/setup failed:',e.message);
      if(IS_PROD) process.exit(1);
    }
  }
  if(razorpay){ const t=setInterval(()=>reconcileOrphanPayments().catch(e=>console.error('Reconcile failed:',e.message)),Math.max(1,Number(process.env.RECONCILE_INTERVAL_SECONDS||600))*1000); t.unref(); }
  app.listen(PORT,()=>console.log(`Tinkerleaf running at http://localhost:${PORT}`));
}
start();
