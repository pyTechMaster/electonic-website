var D={
"products":[["ESP32-CAM WiFi Module with OV3660 3MP Camera",629,744],["Seeed Studio XIAO ESP32-S3 (Wi-Fi & Bluetooth 5.0)",899,1299],["Witty Fox 60W Soldering Iron",164,199],["DM002HW DIY Drone Kit with WiFi and Camera",2899,3649],["Raspberry Pi 3B+",4725,6999],["Bambu Lab A1 Combo 3D Printer with AMS Lite",46999,54999],["Raspberry Pi Pico W (Wi-Fi)",549,699],["SG90 Micro Servo Motor 9g",129,179]],
"g-new":[["Pluto 1.2 Educational Nano DIY Drone Kit",10877,13499],["Holybro Pixhawk 6C Flight Controller with PM02",30046,38499],["Goofoo RP700C 3D Printing Pen",1329,1999],["ACEBOTT QE035 IoT Smart Home Display Kit",23929,39499],["Bambu Lab H2S AMS Combo 3D Printer",176999,184999]],
"g-stem":[["Basic Electronics Learning Kit", 799, 999], ["3 In 1 Educational DIY Solar Robot Kit", 349, 499], ["Official Makey Makey Classic Invention Kit for STEM", 964, 1199], ["2WD Robotics Car Kit for Students", 1199, 1499], ["Obstacle Avoiding Robot Kit", 1799, 2299], ["Arduino UNO Starter Kit for Beginners", 1499, 1899], ["ESP32 IoT Learning Kit", 1899, 2399], ["Simple Circuits Science Kit", 399, 499], ["Mini DIY Drone Kit for Beginners", 1599, 1999], ["DIY Drone Learning Kit with Camera", 2499, 2999]],
"g-tools":[["Digital Multimeter", 449, 599], ["Soldering Wire 50g", 129, 180], ["Wire Stripper and Cutter Set", 249, 349], ["Helping Hands Soldering Stand", 299, 399], ["Soldering Flux Paste", 99, 149], ["Desoldering Pump", 129, 179], ["Needle Nose Pliers", 199, 279], ["Precision Screwdriver Set", 349, 499], ["Digital Vernier Caliper", 399, 549], ["Adjustable DC Power Supply", 3499, 4299]],
"g-components":[["Arduino UNO R3 Compatible Board", 549, 699], ["NodeMCU ESP8266 WiFi Board", 349, 449], ["Arduino Nano Compatible Board", 399, 499], ["Jumper Wires Pack of 120", 149, 199], ["Resistor Assortment Kit", 299, 399], ["Capacitor Assortment Kit", 349, 449], ["LED Assortment Pack", 199, 249], ["5V Relay Module 1 Channel", 79, 119], ["L298N Motor Driver Module", 179, 249], ["HC-SR04 Ultrasonic Sensor", 99, 149], ["DHT11 Temperature and Humidity Sensor", 129, 179]],
"g-displays":[["0.96 inch I2C OLED Display", 199, 299], ["1.3 inch I2C OLED Display", 349, 449], ["16x2 LCD Display with I2C Module", 249, 349], ["20x4 LCD Display with I2C Module", 449, 549], ["2.4 inch TFT Display Module", 449, 599], ["1.8 inch SPI TFT Display", 299, 399], ["3.5 inch TFT Touch Display Shield", 899, 1199], ["4-Digit 7-Segment Display", 99, 149], ["8x8 LED Dot Matrix Display", 129, 179]]
};
var IC={
chip:'<path d="M8 8h8v8H8z M10 4v4 M14 4v4 M10 16v4 M14 16v4 M4 10h4 M4 14h4 M16 10h4 M16 14h4"/>',
drone:'<circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7 7l3 3 M17 7l-3 3 M7 17l3-3 M17 17l-3-3"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/>',
tool:'<path d="M14 6a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3l9-9z"/><path d="M14 6l-2-2"/>',
screen:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M9 21h6 M12 17v4"/>',
kit:'<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V5h6v3 M3 13h18"/>',
print:'<rect x="4" y="3" width="16" height="4" rx="1"/><path d="M6 7v13 M18 7v13 M6 20h12 M9 12h6v4H9z"/>'};
function ico(n,id){var k='chip';
 if(/drone|pixhawk/i.test(n))k='drone';else if(/3d|pen/i.test(n))k='print';else if(/solder|multimeter|wire strip|wire 50/i.test(n))k='tool';else if(/display|oled|lcd|tft|segment/i.test(n))k='screen';else if(id==='g-stem'||/kit/i.test(n))k='kit';
 return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[k]+'</svg>';}
function f(n){return '₹'+n.toLocaleString('en-IN')}
function render(id,a){var g=document.getElementById(id);if(!g)return;
 a.forEach(function(p){
  var m=encodeURIComponent("Hi Tinkerleaf, I have a question about: "+p[0]);
  var d=document.createElement('div');d.className='prod';
  d.innerHTML='<div class="ph">'+(p[3]?'<img alt="" src="'+p[3]+'">':ico(p[0],id))+'</div><h3></h3><div class="price">'+f(p[1])+'<s>'+f(p[2])+'</s></div><a target="_blank" rel="noopener" href="https://wa.me/919122847563?text='+m+'">Ask on WhatsApp</a>';
  d.querySelector('h3').textContent=p[0];
  if(id==='g-new'){var b=document.createElement('span');b.className='badge';b.textContent='New';d.insertBefore(b,d.firstChild.nextSibling);}
  g.appendChild(d);});}
Object.keys(D).forEach(function(k){if(k!=='products')render(k,D[k]);});

document.querySelectorAll('.ph2').forEach(function(e){e.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[e.dataset.k]+'</svg>';});
var sl=document.querySelectorAll('.slide'),dt=document.getElementById('dots'),cur=0,tm;
sl.forEach(function(_,i){var b=document.createElement('button');b.setAttribute('aria-label','Slide '+(i+1));b.onclick=function(){go(i,true)};dt.appendChild(b);});
function go(i,stop){cur=(i+sl.length)%sl.length;sl.forEach(function(x,j){x.classList.toggle('on',j===cur);dt.children[j].classList.toggle('on',j===cur);});if(stop)clearInterval(tm);}
document.getElementById('pv').onclick=function(){go(cur-1,true)};document.getElementById('nx').onclick=function(){go(cur+1,true)};
go(0);
if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches)tm=setInterval(function(){go(cur+1)},5000);

/* ===== STORE SETTINGS (yahin se badlein) ===== */
var CFG={
 FREE_ABOVE:1000,   /* is amount ya usse zyada ke order par delivery FREE */
 SHIP:60,           /* isse kam ke order par flat delivery charge (₹) */
 ORDER_URL:'',      /* Google Apps Script ya Formspree ka URL (README dekhein). Khali = purana WhatsApp-only tareeka */
 GSTIN:'',          /* aapka GSTIN (agar GST registered hain). Khali = site par GSTIN nahi dikhega */
 RZP_KEY:''         /* Razorpay Key ID (rzp_live_... / rzp_test_...). Khali = purana UPI QR + UTR tareeka. ORDER_URL bhi zaroori hai */
};
function shipFor(s){return s>=CFG.FREE_ABOVE?0:CFG.SHIP}
var WA='919122847563',PR={};
Object.keys(D).forEach(function(k){D[k].forEach(function(p){PR[p[0]]=p[1];});});
function ld(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var cart=ld('tl_cart',{}),wish=ld('tl_wish',[]),guest=ld('tl_guest',{}),account=ld('tl_account',null),serverStock={},serverMeta={};
var cartSaveTimer=null;
function apiJSON(url,opt){return fetch(url,Object.assign({credentials:'same-origin'},opt||{})).then(function(r){return r.json().then(function(x){if(!r.ok)throw new Error(x.error||'Request failed');return x})})}
function saveCartServer(){if(!account)return;clearTimeout(cartSaveTimer);cartSaveTimer=setTimeout(function(){apiJSON('/api/cart',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:Object.keys(cart).map(function(n){return {name:n,quantity:cart[n]}})})}).catch(function(e){toast('⚠️ Cart could not be synced: '+e.message)})},180)}
function flushCartServer(){clearTimeout(cartSaveTimer);if(!account)return Promise.resolve();return apiJSON('/api/cart',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:Object.keys(cart).map(function(n){return {name:n,quantity:cart[n]}})})})}
function syncCartAfterAuth(){if(!account)return;apiJSON('/api/cart').then(function(r){var merged={};(r.items||[]).forEach(function(x){merged[x.name]=x.quantity});Object.keys(cart).forEach(function(n){merged[n]=Math.min((merged[n]||0)+cart[n],9999)});cart=merged;upd();saveCartServer()}).catch(function(){})}
function applyPrices(){document.querySelectorAll('.prod').forEach(function(c){var h=c.querySelector('h3'),pe=c.querySelector('.price');if(!h||!pe)return;var n=h.textContent;if(PR[n]!==undefined&&pe.firstChild&&pe.firstChild.nodeType===3)pe.firstChild.nodeValue=f(PR[n])})}
function loadServerStock(){apiJSON('/api/products').then(function(ps){serverStock={};var pc=false;ps.forEach(function(p){serverStock[p.name]=Number(p.stock||0);serverMeta[p.name]=Date.parse(p.createdAt)||0;var pr=Number(p.price);if(Object.prototype.hasOwnProperty.call(PR,p.name)&&Number.isFinite(pr)&&PR[p.name]!==pr){PR[p.name]=pr;pc=true}});applyStock();if(pc){applyPrices();upd()}if(window.TLshop&&TLshop.refresh)TLshop.refresh()}).catch(function(){})}
loadServerStock();
apiJSON('/api/auth/me').then(function(r){var wasIn=!!account;if(r.user){account={name:r.user.name,email:r.user.email,role:r.user.role};sv('tl_account',account);syncCartAfterAuth();if(!wasIn&&/^#pg=(orders|track)/.test(location.hash))route();}else if(account){account=null;sv('tl_account',null);}}).catch(function(){});
apiJSON('/api/payments/razorpay/config').then(function(r){if(r.enabled&&r.keyId)CFG.RZP_KEY=r.keyId;}).catch(function(){});

function esc(t){return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function $(i){return document.getElementById(i)}
function toast(m){var t=$('ts');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('on')},2200)}
function cnt(){return Object.keys(cart).reduce(function(a,k){return a+cart[k]},0)}
function total(){return Object.keys(cart).reduce(function(a,k){return a+cart[k]*(PR[k]||0)},0)}
function upd(){$('cc').textContent=cnt();$('wc').textContent=wish.length;
 var mb=$('mobileCartBar'),mc=$('mobileCartCount'),mt=$('mobileCartTotal');if(mb&&mc&&mt){var c=cnt(),t=total();mb.classList.toggle('has-items',c>0);mc.textContent=c?c+' item'+(c===1?'':'s'):'Cart is empty';mt.textContent=c?rup(t):'View cart';}
 document.querySelectorAll('.heart').forEach(function(h){var on=wish.indexOf(h.dataset.n)>-1;h.textContent=on?'❤️':'🤍';h.setAttribute('aria-pressed',on)});
 sv('tl_cart',cart);sv('tl_wish',wish);saveCartServer()}
var OUT=(typeof OUT_OF_STOCK!=='undefined'?OUT_OF_STOCK:[]);
function inStock(n){if(OUT.indexOf(n)>-1)return false;if(Object.prototype.hasOwnProperty.call(serverStock,n))return serverStock[n]>0;return true}
OUT.forEach(function(n){if(PR[n]===undefined&&window.console)console.warn('stock.js: product naam match nahi hua:',n)});
function addC(n,q){if(!inStock(n)){toast('😕 Sorry, this product is out of stock');return}cart[n]=(cart[n]||0)+(q||1);upd();toast('🛒 Added to cart')}
/* stock badge + disabled button, sab product cards par (idempotent) */
function applyStock(){document.querySelectorAll('.prod').forEach(function(p){var h=p.querySelector('h3');if(!h)return;var n=h.textContent,out=!inStock(n);
 p.classList.toggle('oos',out);var b=p.querySelector('.add');
 if(b){b.disabled=out;b.textContent=out?'Out of stock':'🛒 Add to cart'}
 var t=p.querySelector('.stk');if(out&&!t){t=document.createElement('span');t.className='stk';t.textContent='Out of stock';p.insertBefore(t,p.firstChild)}else if(!out&&t)t.remove()})}
var _sq=0;new MutationObserver(function(){if(_sq)return;_sq=requestAnimationFrame(function(){_sq=0;applyStock()})}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',applyStock);
function togW(n){var i=wish.indexOf(n);if(i>-1){wish.splice(i,1);toast('💔 Removed from wishlist')}else{wish.push(n);toast('❤️ Saved to wishlist')}upd();if(view==='wish')show('wish')}
document.querySelectorAll('.prod').forEach(function(p){
 var n=p.querySelector('h3').textContent,h=document.createElement('button');
 h.className='heart';h.dataset.n=n;h.setAttribute('aria-label','Add to wishlist');h.onclick=function(){togW(n)};p.querySelector('.ph').appendChild(h);
 var a=p.querySelector('a'),r=document.createElement('div');r.className='act';
 var b=document.createElement('button');b.className='add';b.textContent='🛒 Add to cart';b.onclick=function(){addC(n)};
 a.parentNode.insertBefore(r,a);r.appendChild(b);r.appendChild(a);a.textContent='💬 WhatsApp';a.classList.add('ow');});
var view='';
function openD(side){var d=$('dr');d.className='drawer '+side+' on';d.setAttribute('aria-hidden','false');$('ov').classList.add('on')}
function closeAll(){$('dr').classList.remove('on');$('dr').setAttribute('aria-hidden','true');$('ov').classList.remove('on');$('md').classList.remove('on');view=''}
function accountModal(mode){
 var m=$('md'),b=$('mb');if(!m||!b)return;
 var signed=!!account;
 if(signed){
  b.innerHTML='<button class="mx" type="button" aria-label="Close">✕</button><div class="account-head"><span class="account-key">👤</span><div><h2>My account</h2><p>You are signed in to Tinkerleaf.</p></div></div><div class="account-card"><b>'+esc(account.name||'Tinkerleaf customer')+'</b><span>'+esc(account.email||'')+'</span></div><div class="row" style="display:grid;gap:8px"><button class="btn" type="button" id="accountOrders">📦 My Orders</button><button class="btn alt" type="button" id="accountAddresses">📍 Saved Addresses</button><button class="btn alt" type="button" id="accountContinue">Continue shopping</button></div><button class="sw account-link" type="button" id="accountSignOut">Sign out</button>';
 }else if(mode==='forgot'){
  b.innerHTML='<button class="mx" type="button" aria-label="Close">✕</button><div class="account-head"><span class="account-key">🔐</span><div><h2>Forgot password?</h2><p>We will send a secure reset link to your email.</p></div></div><form id="forgotForm" class="account-form"><label class="l">Email</label><input name="email" type="email" autocomplete="email" required><div class="ce" id="accountError" role="alert"></div><button class="btn" type="submit">Send reset link</button></form><div class="account-switch"><button class="sw" type="button" id="backToSignIn">← Back to sign in</button></div>';
 }else{
  var create=mode==='create';
  b.innerHTML='<button class="mx" type="button" aria-label="Close">✕</button><div class="account-head"><span class="account-key">👤</span><div><h2>'+(create?'Create account':'Sign in')+'</h2><p>'+(create?'Save your Tinkerleaf account securely.':'Sign in to your Tinkerleaf account.')+'</p></div></div><form id="accountForm" class="account-form">'+(create?'<label class="l">Name</label><input name="name" autocomplete="name" required>':'')+'<label class="l">Email</label><input name="email" type="email" autocomplete="email" required><label class="l">Password</label><input name="password" type="password" minlength="6" autocomplete="current-password" required><div class="ce" id="accountError" role="alert"></div><button class="btn" type="submit">'+(create?'Create account':'Sign in')+'</button></form><div class="account-switch">'+(!create?'<button class="sw" type="button" id="forgotPassword">Forgot password?</button><br>':'')+(create?'Already have an account? <button class="sw" type="button" id="accountToSignIn">Sign in</button>':'New here? <button class="sw" type="button" id="accountToCreate">Create account</button>')+'</div>';
 }
 m.classList.add('on');$('ov').classList.add('on');b.scrollTop=0;
 var close=b.querySelector('.mx');if(close)close.onclick=closeAll;
 var form=b.querySelector('#forgotForm');
 if(form) form.addEventListener('submit',function(e){e.preventDefault();var email=String(new FormData(form).get('email')||'').trim().toLowerCase(),err=$('accountError');err.textContent='Sending…';fetch('/api/auth/forgot-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email})}).then(function(r){return r.json()}).then(function(x){err.textContent=x.message||'If the account exists, check your email.'}).catch(function(){err.textContent='Could not send reset email.'})});
 var af=b.querySelector('#accountForm');
 if(af)af.addEventListener('submit',function(e){e.preventDefault();var fd=new FormData(af),email=String(fd.get('email')||'').trim().toLowerCase(),pass=String(fd.get('password')||''),err=$('accountError'),endpoint=mode==='create'?'/api/auth/register':'/api/auth/login',name=String(fd.get('name')||'').trim();
   if(mode==='create'&&!name){err.textContent='Please enter your name.';return} if(pass.length<6){err.textContent='Password must be at least 6 characters.';return} err.textContent='Connecting securely…';
   fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(mode==='create'?{name:name,email:email,password:pass}:{email:email,password:pass})}).then(function(r){return r.json().then(function(x){return {ok:r.ok,data:x}})}).then(function(r){
     if(!r.ok)throw new Error(r.data.error||'Request failed');
     if(mode==='create'&&r.data.pendingVerification){err.textContent='✅ Account created. Check your email and click the verification link before signing in.';var resend=document.createElement('button');resend.className='sw';resend.type='button';resend.textContent='Resend verification email';resend.onclick=function(){fetch('/api/auth/resend-verification',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email})}).then(function(x){return x.json()}).then(function(x){err.textContent=x.message||'Verification email requested.'})};err.appendChild(document.createElement('br'));err.appendChild(resend);return}
     account={name:r.data.user.name,email:r.data.user.email,role:r.data.user.role};sv('tl_account',account);guest.name=account.name||guest.name;guest.email=account.email||guest.email;sv('tl_guest',guest);syncCartAfterAuth();toast(mode==='create'?'✅ Account created':'👋 Welcome back');accountModal('signed');if(/^#pg=(orders|track)/.test(location.hash))route()
   }).catch(function(e){err.textContent=e.message||'Could not connect to the server. Start Tinkerleaf with npm start.'});
 });
 var toCreate=b.querySelector('#accountToCreate');if(toCreate)toCreate.onclick=function(){accountModal('create')};
 var toSign=b.querySelector('#accountToSignIn');if(toSign)toSign.onclick=function(){accountModal('signin')};
 var forgot=b.querySelector('#forgotPassword');if(forgot)forgot.onclick=function(){accountModal('forgot')};
 var back=b.querySelector('#backToSignIn');if(back)back.onclick=function(){accountModal('signin')};
 var ord=b.querySelector('#accountOrders');if(ord)ord.onclick=function(){closeAll();show('orders')};
 var addr=b.querySelector('#accountAddresses');if(addr)addr.onclick=function(){closeAll();show('addresses')};
 var signOut=b.querySelector('#accountSignOut');if(signOut)signOut.onclick=function(){fetch('/api/auth/logout',{method:'POST'}).finally(function(){account=null;sv('tl_account',null);toast('Signed out');closeAll()})};
 var cont=b.querySelector('#accountContinue');if(cont)cont.onclick=closeAll;
}
function resetPasswordFromUrl(){
 var q=new URLSearchParams(location.search),token=q.get('reset'),email=q.get('email');if(!token||!email)return;
 var m=$('md'),b=$('mb');if(!m||!b)return;
 b.innerHTML='<button class="mx" type="button" aria-label="Close">✕</button><div class="account-head"><span class="account-key">🔐</span><div><h2>Set new password</h2><p>Create a new password for your Tinkerleaf account.</p></div></div><form id="resetForm" class="account-form"><label class="l">New password</label><input name="password" type="password" minlength="6" required><label class="l">Confirm password</label><input name="confirm" type="password" minlength="6" required><div class="ce" id="accountError" role="alert"></div><button class="btn" type="submit">Reset password</button></form>';
 m.classList.add('on');$('ov').classList.add('on');b.querySelector('.mx').onclick=closeAll;
 b.querySelector('#resetForm').onsubmit=function(e){e.preventDefault();var f=new FormData(e.target),p=String(f.get('password')||''),c=String(f.get('confirm')||''),er=$('accountError');if(p.length<6){er.textContent='Password must be at least 6 characters.';return}if(p!==c){er.textContent='Passwords do not match.';return}er.textContent='Resetting…';fetch('/api/auth/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,token:token,password:p})}).then(function(r){return r.json().then(function(x){return {ok:r.ok,data:x}})}).then(function(r){if(!r.ok)throw new Error(r.data.error||'Reset failed');er.textContent='✅ '+r.data.message;history.replaceState({},'',location.pathname);setTimeout(function(){accountModal('signin')},800)}).catch(function(e){er.textContent=e.message})};
}
function row(n,k){return '<div class="li"><div>'+esc(n)+'<b>₹'+(PR[n]||0).toLocaleString('en-IN')+'</b></div>'+k+'</div>'}
function show(v){view=v;var b=$('db'),t=$('dt'),h='';
 if(v==='menu'){t.textContent='🍃 Tinkerleaf';
  h='<div class="hi">👋 <b>Welcome to Tinkerleaf</b>Create an account or sign in before placing an order.</div>';
  h+='<button class="mi" data-a="orders">📦 My Orders</button><a class="mi" href="#pg=track" data-a="x">🚚 Track Order</a><button class="mi" data-a="addresses">📍 Saved Addresses</button><button class="mi" data-a="wish">❤️ My wishlist <small>'+wish.length+'</small></button><button class="mi" data-a="cart">🛒 My cart <small>'+cnt()+'</small></button><a class="mi" href="#guidance" data-a="x">🎫 Project guidance</a><a class="mi" href="#b2b" data-a="x">🏢 B2B Orders</a><a class="mi" href="#lab" data-a="x">🧪 Lab Setup</a><a class="mi" href="#hub" data-a="x">📚 Knowledge Hub</a><a class="mi" href="#services" data-a="x">🎓 Projects &amp; Training</a><a class="mi" href="#pg=about" data-a="x">ℹ️ About Us</a><a class="mi" href="#pg=contact" data-a="x">📞 Contact Us</a><a class="mi" href="#pg=privacy" data-a="x">🔒 Privacy Policy</a><a class="mi" href="#pg=policy" data-a="x">📦 Return &amp; Delivery</a><a class="mi" href="#pg=terms" data-a="x">📜 Terms &amp; Conditions</a><a class="mi" href="#shop" data-a="x">🛍️ Shop By Category</a><a class="mi" href="#brands" data-a="x">🏷️ Shop By Brand</a><a class="mi" target="_blank" rel="noopener" href="https://wa.me/'+WA+'">💬 Chat on WhatsApp</a>'+appMenuHTML();
  openD('l')}
 if(v==='wish'){t.textContent='❤️ My wishlist';
  h=wish.length?wish.map(function(n){return row(n,(inStock(n)?'<button class="add" data-c="'+esc(n)+'">🛒 Add</button>':'<span class="stk" style="position:static;transform:none;box-shadow:none">Out of stock</span>')+'<button class="rm" data-w="'+esc(n)+'" aria-label="Remove">✕</button>')}).join(''):'<div class="empty">🤍 Your wishlist is empty.<br>Tap the heart on any product.</div>';openD('r')}
 if(v==='cart'){t.textContent='🛒 My cart';var ks=Object.keys(cart);
  if(!ks.length)h='<div class="empty">🛒 Your cart is empty.</div>';
  else{h=ks.map(function(n){return row(n,'<div class="q"><button data-m="'+esc(n)+'" aria-label="Less">−</button><input class="qinput" data-q="'+esc(n)+'" type="number" min="1" step="1" inputmode="numeric" aria-label="Quantity for '+esc(n)+'" value="'+cart[n]+'"><button data-p="'+esc(n)+'" aria-label="More">+</button></div>')}).join('');
   var T=total(),S=shipFor(T);
   h+='<div class="cs"><span>Subtotal</span><span>'+rup(T)+'</span></div><div class="cs"><span>Delivery</span><span>'+(S?rup(S):'<b style="color:var(--green)">FREE</b>')+'</span></div><div class="tot"><span>Total</span><span>'+rup(T+S)+'</span></div>';
   h+=S?'<div class="note">🚚 Add '+rup(CFG.FREE_ABOVE-T)+' more to get <b>free delivery</b>. Delivery charge below '+rup(CFG.FREE_ABOVE)+' is '+rup(CFG.SHIP)+'.</div>':'<div class="note">🎉 You get <b>free delivery</b> on this order.</div>';
   h+=T>=1000?'<div class="note">🎫 You also get a Project Guidance Card with this order, valid for 15 days.</div>':'<div class="note">🎫 Add ₹'+(1000-T).toLocaleString('en-IN')+' more to get a free Project Guidance Card.</div>';
   h+='<button class="btn" data-a="checkout" style="display:block;width:100%;border:0;cursor:pointer;font:inherit;font-weight:600">🧾 Proceed to checkout</button><div class="note" style="margin-top:12px">🚚 Delivery all over India. <a href="#pg=policy" data-a="x">Delivery policy</a><br>💵 Cash on Delivery and 📲 Online payment available.<br>👤 Create an account or sign in before placing an order.</div>'}
  openD('r')}
 if(v==='orders'){closeAll();if(location.hash==='#pg=orders')route();else location.hash='#pg=orders';return}
 if(v==='addresses'){t.textContent='📍 Saved Addresses';h='<div class="empty">Loading your saved addresses…</div>';openD('r');loadAddressesView();}
 if(v==='checkout'){t.textContent='🧾 Checkout';h=checkoutHTML();openD('r');loadCheckoutAddresses()}
 if(v==='pay'){t.textContent='📲 Pay online';h=payHTML();openD('r')}
 if(v==='done'){t.textContent=lastOrder&&lastOrder.pm==='online'?'🎉 Payment sent':'🎉 Order placed';h=doneHTML();openD('r')}
 b.innerHTML=h;b.scrollTop=0;$('dr').scrollTop=0;if(v==='pay')drawQR();else if(v==='checkout'){payBtnLabel();var pb=$('checkPin');if(pb)pb.onclick=checkDeliveryPin;var pi=$('c5');if(pi)pi.oninput=function(){$('pinResult').dataset.serviceable='no';$('pinResult').textContent='Check your pincode before placing the order.'};if(pi&&/^\d{6}$/.test(pi.value))checkDeliveryPin()}}
$('hb').onclick=function(){show('menu')};$('hw').onclick=function(){show('wish')};$('hc').onclick=function(){show('cart')};$('ha').onclick=function(){accountModal('signin')};$('mobileCartBar').onclick=function(){show('cart')};
$('dx').onclick=closeAll;$('ov').onclick=closeAll;
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
$('db').addEventListener('change',function(e){var q=e.target.closest('[data-q]');if(!q)return;var n=q.dataset.q,v=parseInt(q.value,10);if(!inStock(n)){delete cart[n];upd();show('cart');return}if(!Number.isFinite(v)||v<1){q.value=cart[n]||1;toast('⚠️ Quantity must be at least 1');return}cart[n]=Math.min(v,9999);upd();show('cart')});
$('db').addEventListener('click',function(e){var t=e.target.closest('[data-a],[data-c],[data-w],[data-m],[data-p],[data-track],[data-deladdr]');if(!t)return;var d=t.dataset;if(t.tagName==='A'&&t.getAttribute('href')==='#')e.preventDefault();
 if(d.deladdr!==undefined){apiJSON('/api/addresses/'+d.deladdr,{method:'DELETE'}).then(function(){loadAddressesView();toast('Address removed')});return}
 if(t.dataset.cancelOrder){var oid=t.dataset.cancelOrder;if(confirm('Cancel order '+oid+'?')){var reason=prompt('Reason (optional):','Customer requested cancellation')||'Customer requested cancellation';apiJSON('/api/orders/'+encodeURIComponent(oid)+'/cancel',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({reason:reason})}).then(function(){toast('✅ Order cancelled');show('orders')}).catch(function(e){toast('⚠️ '+e.message)})}return}
 if(t.dataset.returnOrder){var rid=t.dataset.returnOrder,rr=prompt('Why do you want to return this order?');if(rr){apiJSON('/api/orders/'+encodeURIComponent(rid)+'/return-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reason:rr})}).then(function(){toast('✅ Return request submitted');show('orders')}).catch(function(e){toast('⚠️ '+e.message)})}return}if(d.a==='checkout'){if(!account){accountModal('create');toast('👤 Please create an account or sign in before checkout.');return}show('checkout');return}if(d.a==='place'){placeOrder();return}if(d.a==='payok'){confirmPay();return}if(d.a==='paychg'){show('checkout');return}if(d.a==='copyupi'){copyUPI();return}if(d.a==='back'){show('cart');return}if(d.a==='wish'||d.a==='cart'||d.a==='orders'||d.a==='addresses')show(d.a);else if(d.a==='x'||d.a==='x2')closeAll();
 else if(d.c){addC(d.c);show('wish')}else if(d.w)togW(d.w);
 else if(d.p){cart[d.p]++;upd();show('cart')}
 else if(d.m){cart[d.m]--;if(cart[d.m]<1)delete cart[d.m];upd();show('cart')}});
document.querySelectorAll('.ti').forEach(function(e){e.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[e.dataset.k]+'</svg>';});
IC.wifi='<path d="M2 9a15 15 0 0 1 20 0 M5 12.5a10 10 0 0 1 14 0 M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>';
IC.sensor='<circle cx="12" cy="12" r="3"/><path d="M5 12a7 7 0 0 1 7-7 M19 12a7 7 0 0 1-7 7 M2 12a10 10 0 0 1 10-10 M22 12a10 10 0 0 1-10 10"/>';
document.querySelectorAll('.bg').forEach(function(e){e.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[e.dataset.k]+'</svg>';});
var PIMG={"ESP32-CAM WiFi Module with OV3660 3MP Camera": "images/img33.webp", "Seeed Studio XIAO ESP32-S3 (Wi-Fi & Bluetooth 5.0)": "images/img34.webp", "Witty Fox 60W Soldering Iron": "images/img35.webp", "DM002HW DIY Drone Kit with WiFi and Camera": "images/img36.webp", "Raspberry Pi 3B+": "images/img37.webp", "Bambu Lab A1 Combo 3D Printer with AMS Lite": "images/img38.webp"},PDET={"ESP32-CAM WiFi Module with OV3660 3MP Camera": {"d": "A compact Wi-Fi and Bluetooth camera board built on the ESP32 chip. Use it for IoT cameras, video streaming, face detection projects and simple security cameras.", "s": [["Camera", "OV3660, 3 MP"], ["Wireless", "Wi-Fi and Bluetooth"], ["Storage", "microSD card slot"], ["Extras", "Onboard flash LED"], ["Power", "5V supply"], ["Programming", "Needs a USB-to-serial (FTDI) adapter, no onboard USB"]], "b": ["1 x ESP32-CAM board with camera module"]}, "Seeed Studio XIAO ESP32-S3 (Wi-Fi & Bluetooth 5.0)": {"d": "A tiny, powerful board from Seeed Studio with Wi-Fi and Bluetooth 5.0. Good for wearables, small IoT devices and camera or sensor projects where size matters.", "s": [["Processor", "Dual-core ESP32-S3, up to 240 MHz"], ["Wireless", "2.4 GHz Wi-Fi and Bluetooth 5.0 (LE)"], ["Connector", "USB Type-C"], ["Size", "About 21 x 17.8 mm"], ["Best for", "Wearables, IoT, small sensor projects"]], "b": ["1 x XIAO ESP32-S3 board"]}, "Witty Fox 60W Soldering Iron": {"d": "A 60W soldering iron with an adjustable temperature dial and a set of interchangeable tips. A solid first iron for electronics repair and DIY projects.", "s": [["Power", "60 W"], ["Temperature", "Adjustable with dial"], ["Plug", "EU 2-pin plug"], ["Tips", "5 interchangeable tips"]], "b": ["1 x Soldering iron", "5 x Soldering tips (as shown)"]}, "DM002HW DIY Drone Kit with WiFi and Camera": {"d": "A beginner-friendly DIY drone kit with a Wi-Fi camera. Learn how drones work, build your own and fly it with the included remote controller.", "s": [["Camera", "Wi-Fi camera for live view"], ["Control", "Remote controller and phone"], ["Level", "Beginner friendly"], ["Use", "Learning, flying and building projects"]], "b": ["1 x Drone", "2 x Batteries", "1 x Remote controller", "Spare propellers", "Propeller guards", "USB charging cable", "Carry case"]}, "Raspberry Pi 3B+": {"d": "A credit-card sized computer for learning to code, building media centres, home servers and robotics. Faster processor and better wireless than earlier Pi 3 models.", "s": [["Processor", "Broadcom BCM2837B0, quad-core 64-bit, 1.4 GHz"], ["Memory", "1 GB LPDDR2 RAM"], ["Wireless", "Dual-band Wi-Fi (2.4/5 GHz), Bluetooth 4.2 / BLE"], ["Network", "Gigabit Ethernet over USB 2.0"], ["Ports", "4 x USB 2.0, HDMI, 3.5 mm audio/composite"], ["GPIO", "40-pin header"], ["Storage", "microSD card slot"]], "b": ["1 x Raspberry Pi 3 Model B+ board"]}, "Bambu Lab A1 Combo 3D Printer with AMS Lite": {"d": "A fast, easy-to-use 3D printer from Bambu Lab. The Combo includes the AMS Lite so you can print in up to 4 colours. Great for prototypes, enclosures, parts and models.", "s": [["Build volume", "256 x 256 x 256 mm"], ["Multicolour", "Up to 4 filaments with AMS Lite"], ["Print speed", "Up to 500 mm/s"], ["Bed levelling", "Automatic"], ["Screen", "Colour touchscreen"], ["Filaments", "PLA, PETG, TPU and more"]], "b": ["1 x Bambu Lab A1 printer", "1 x AMS Lite (multicolour unit)"]}},OP={};
Object.assign(PIMG,{"0.96 inch I2C OLED Display": "images/img39.webp", "1.3 inch I2C OLED Display": "images/img40.webp", "1.8 inch SPI TFT Display": "images/img41.webp", "16x2 LCD Display with I2C Module": "images/img42.webp", "2.4 inch TFT Display Module": "images/img43.webp", "20x4 LCD Display with I2C Module": "images/img44.webp", "2WD Robotics Car Kit for Students": "images/img45.webp", "3 In 1 Educational DIY Solar Robot Kit": "images/img46.webp", "3.5 inch TFT Touch Display Shield": "images/img47.webp", "4-Digit 7-Segment Display": "images/img48.webp", "5V Relay Module 1 Channel": "images/img49.webp", "8x8 LED Dot Matrix Display": "images/img50.webp", "Adjustable DC Power Supply": "images/img51.webp", "Arduino Nano Compatible Board": "images/img52.webp", "Arduino UNO R3 Compatible Board": "images/img53.webp", "Arduino UNO Starter Kit for Beginners": "images/img54.webp", "Basic Electronics Learning Kit": "images/img55.webp", "Capacitor Assortment Kit": "images/img56.webp", "DHT11 Temperature and Humidity Sensor": "images/img58.webp", "DIY Drone Learning Kit with Camera": "images/img59.webp", "Desoldering Pump": "images/img60.webp", "Digital Multimeter": "images/img61.webp", "Digital Vernier Caliper": "images/img62.webp", "ESP32 IoT Learning Kit": "images/img63.webp", "HC-SR04 Ultrasonic Sensor": "images/img64.webp", "Helping Hands Soldering Stand": "images/img65.webp", "Jumper Wires Pack of 120": "images/img66.webp", "L298N Motor Driver Module": "images/img67.webp", "LED Assortment Pack": "images/img68.webp", "Mini DIY Drone Kit for Beginners": "images/img69.webp", "Needle Nose Pliers": "images/img70.webp", "NodeMCU ESP8266 WiFi Board": "images/img71.webp", "Obstacle Avoiding Robot Kit": "images/img72.webp", "Official Makey Makey Classic Invention Kit for STEM": "images/img73.webp", "Precision Screwdriver Set": "images/img74.webp", "Resistor Assortment Kit": "images/img75.webp", "Simple Circuits Science Kit": "images/img76.webp", "Soldering Flux Paste": "images/img77.webp", "Soldering Wire 50g": "images/img78.webp", "Wire Stripper and Cutter Set": "images/img79.webp"});Object.assign(PDET,{"3 In 1 Educational DIY Solar Robot Kit": {"d": "A hands-on science kit where students build a solar-powered robot and then rebuild it into different models. Builds creativity and an understanding of solar energy and simple machines.", "s": [["Type", "DIY solar robot kit"], ["Power", "Solar energy"], ["Builds", "Several robot models (as shown in the photo)"], ["Level", "Beginner, STEM learning"], ["Assembly", "Required, no soldering"]], "b": ["Robot building parts and gears", "Solar panel and motor", "Wheels and connectors", "Contents as shown in the photo"]}, "Precision Screwdriver Set": {"d": "A set of small precision screwdrivers for electronics, toys, gadgets and small repairs. Comes in a compact case.", "s": [["Type", "Precision screwdriver set"], ["Pieces", "8 screwdrivers"], ["Case", "Compact carry case"]], "b": ["8 x Precision screwdrivers", "1 x Carry case"]}, "Digital Vernier Caliper": {"d": "A digital vernier caliper for precise measurements of length, diameter and thickness. Large LCD screen gives a quick, clear reading.", "s": [["Type", "Digital vernier caliper"], ["Display", "LCD"], ["Use", "Length, diameter and thickness"]], "b": ["1 x Digital vernier caliper"]}, "DIY Drone Learning Kit with Camera": {"d": "A DIY drone kit for learning to build, fly and code your own drone. A good way for students to understand how drones work.", "s": [["Type", "DIY drone learning kit"], ["Learn", "Build, fly and code"], ["Level", "Beginner, STEM learning"], ["Made in", "India (as marked on the box)"]], "b": ["Drone parts and frame", "Propeller guards", "Contents as shown in the photo"]}, "3.5 inch TFT Touch Display Shield": {"d": "A 3.5 inch TFT touch display shield that plugs on top of your Arduino board. Large colour screen with a microSD slot.", "s": [["Size", "3.5 inch"], ["Type", "TFT LCD shield for Arduino"], ["Touch", "Touch screen"], ["Extras", "microSD card slot"]], "b": ["1 x 3.5 inch TFT touch display shield"]}, "Arduino UNO Starter Kit for Beginners": {"d": "A beginner Arduino kit with a UNO board and many common parts. Learn by building projects such as LED blink, buttons, sensors, displays and motors.", "s": [["Board", "Arduino UNO"], ["Level", "Beginner"], ["Good for", "Learning coding and electronics"], ["Includes", "Display, sensors, LEDs and more"]], "b": ["Arduino UNO board with USB cable", "Breadboard and jumper wires", "16x2 LCD display", "7-segment display", "Relay module", "LEDs, resistors and push buttons", "Potentiometer, LDR and buzzer", "DC motor with propeller", "9V battery clip", "Contents as shown in the photo"]}, "Jumper Wires Pack of 120": {"d": "A pack of 120 colourful jumper wires for connecting boards, sensors and breadboards. Includes the three common types.", "s": [["Quantity", "120 wires"], ["Types", "Male to male, male to female, female to female"], ["Use", "Breadboard and Arduino connections"]], "b": ["120 x Jumper wires (3 bundles as shown)"]}, "Needle Nose Pliers": {"d": "Needle nose pliers for holding, bending and placing small wires and components. A basic tool for every electronics workbench.", "s": [["Type", "Needle nose pliers"], ["Handle", "Red grip handles"], ["Use", "Holding and bending small wires"]], "b": ["1 x Needle nose pliers"]}, "L298N Motor Driver Module": {"d": "A dual H-bridge motor driver module to control the speed and direction of two DC motors. Popular for robot cars.", "s": [["Chip", "L298N"], ["Controls", "2 DC motors"], ["Connections", "Screw terminals"], ["Use", "Robot cars and motor projects"]], "b": ["1 x L298N motor driver module"]}, "5V Relay Module 1 Channel": {"d": "A 1-channel 5V relay module to switch lamps, fans and other loads from an Arduino or ESP board. Has indicator LEDs.", "s": [["Channels", "1"], ["Coil voltage", "5 V DC"], ["Switching", "Up to 10 A at 250 V AC (as marked on relay)"], ["Pins", "VCC, GND, IN"]], "b": ["1 x 5V 1-channel relay module"]}, "Mini DIY Drone Kit for Beginners": {"d": "A DIY mini quadcopter kit for beginners. Assemble the drone yourself, learn how its parts work and fly it with the remote controller.", "s": [["Type", "DIY mini drone kit"], ["Control", "Remote controller"], ["Level", "Beginner"], ["Assembly", "Required"]], "b": ["Quadcopter frame and motors", "4 x Propellers", "Battery", "Remote controller", "Contents as shown in the photo"]}, "2.4 inch TFT Display Module": {"d": "A 2.4 inch colour TFT display with 240 x 320 resolution and touch support, plus an SD card slot on the back. Great for dashboards and simple games.", "s": [["Size", "2.4 inch"], ["Resolution", "240 x 320"], ["Interface", "SPI"], ["Extras", "Touch pins and SD card slot (as marked on board)"]], "b": ["1 x 2.4 inch TFT display module"]}, "0.96 inch I2C OLED Display": {"d": "A small, sharp OLED screen that connects with just 4 wires over I2C. Show text, numbers and simple graphics on Arduino, ESP32 and Raspberry Pi projects.", "s": [["Size", "0.96 inch"], ["Interface", "I2C"], ["Pins", "4 (GND, VCC, SCL, SDA)"], ["Works with", "Arduino, ESP32, Raspberry Pi"]], "b": ["1 x 0.96 inch OLED display", "1 x 4-pin header strip (as shown in the photo)"]}, "Arduino UNO R3 Compatible Board": {"d": "An Arduino UNO R3 compatible board for learning electronics and building projects. Works with the Arduino IDE and most UNO shields and sensors.", "s": [["Type", "UNO R3 compatible board"], ["Controller", "ATmega328 based"], ["USB", "Micro-USB port"], ["Power", "USB or DC jack"], ["Pins", "Digital 0-13 and analog A0-A5"]], "b": ["1 x UNO R3 compatible board"]}, "DHT11 Temperature and Humidity Sensor": {"d": "A temperature and humidity sensor module with a digital output. Easy to use with Arduino and ESP boards for weather and room monitors.", "s": [["Measures", "Temperature and humidity"], ["Pins", "3 (DOUT, GND, VCC)"], ["Output", "Digital"], ["Indicator", "Power LED"]], "b": ["1 x DHT11 temperature and humidity module"]}, "Soldering Flux Paste": {"d": "Soldering flux paste that helps solder flow smoothly and make clean, shiny joints. Apply a little before soldering.", "s": [["Type", "Soldering flux paste"], ["Pack", "Tin"], ["Use", "Cleaner, stronger solder joints"]], "b": ["1 x Flux paste tin"]}, "8x8 LED Dot Matrix Display": {"d": "An 8x8 LED dot matrix display with a driver board. Show scrolling text, icons and simple animations with an Arduino.", "s": [["Matrix", "8 x 8 LEDs"], ["Module", "With driver board"], ["Use", "Scrolling text and icons"]], "b": ["1 x 8x8 LED dot matrix with driver board", "Header pins (as shown in the photo)"]}, "Digital Multimeter": {"d": "A handy digital multimeter for testing voltage, current and resistance in your electronics projects. Useful for students, hobbyists and repair work.", "s": [["Type", "Digital multimeter (DT830D)"], ["Measures", "DC voltage, AC voltage, DC current, resistance"], ["Extras", "Transistor (hFE) test and continuity buzzer"], ["Display", "LCD"]], "b": ["1 x Digital multimeter", "1 x Red test lead", "1 x Black test lead"]}, "Helping Hands Soldering Stand": {"d": "A helping hands stand with four flexible arms and clips to hold your circuit board steady while you solder. Leaves both your hands free.", "s": [["Type", "Helping hands PCB holder"], ["Arms", "4 flexible arms with alligator clips"], ["Base", "Heavy metal base"], ["Use", "Soldering and repair work"]], "b": ["1 x Helping hands stand with 4 clip arms and base"]}, "NodeMCU ESP8266 WiFi Board": {"d": "A Wi-Fi development board based on the ESP8266. Great for IoT projects like home automation, web servers and sensor monitoring. Programs from the Arduino IDE.", "s": [["Chip", "ESP8266 (ESP-12 module)"], ["Wireless", "2.4 GHz Wi-Fi 802.11 b/g/n"], ["USB", "Micro-USB port"], ["Buttons", "Flash and Reset"], ["Programming", "Arduino IDE, MicroPython"]], "b": ["1 x NodeMCU ESP8266 board"]}, "1.3 inch I2C OLED Display": {"d": "A larger 1.3 inch OLED display with a bright white screen and simple 4-wire I2C connection. Good for readable menus and sensor readings.", "s": [["Size", "1.3 inch"], ["Colour", "White"], ["Interface", "I2C, 4 pins"], ["Pins", "VDD, GND, SCK, SDA (as marked)"]], "b": ["1 x 1.3 inch OLED display"]}, "Official Makey Makey Classic Invention Kit for STEM": {"d": "Turn everyday objects like fruit, clay and foil into touchpads. Connect Makey Makey to a computer with the USB cable and play, create and invent without writing any code.", "s": [["Type", "Invention kit for STEM learning"], ["Connects to", "Computer via USB"], ["Coding", "Not required to start"], ["Level", "Beginner, kids and students"]], "b": ["Makey Makey board", "USB cable", "Alligator clips", "Connector wires", "Instruction booklet"]}, "1.8 inch SPI TFT Display": {"d": "A compact 1.8 inch colour TFT display with an SPI interface and a microSD card slot. Good for small colour graphics and images.", "s": [["Size", "1.8 inch"], ["Resolution", "128 x 160"], ["Interface", "SPI"], ["Extras", "SD card slot"]], "b": ["1 x 1.8 inch SPI TFT display"]}, "HC-SR04 Ultrasonic Sensor": {"d": "An ultrasonic distance sensor that measures how far an object is. Used in obstacle avoiding robots and distance meters.", "s": [["Sensor", "HC-SR04 ultrasonic"], ["Pins", "VCC, Trig, Echo, GND"], ["Supply", "5 V"], ["Use", "Distance measurement, obstacle detection"]], "b": ["1 x HC-SR04 ultrasonic sensor"]}, "Obstacle Avoiding Robot Kit": {"d": "Build a robot car that senses objects with an ultrasonic sensor and steers around them. A complete project to learn Arduino, sensors and motor control.", "s": [["Type", "Obstacle avoiding robot kit"], ["Controller", "Arduino UNO board"], ["Sensor", "Ultrasonic distance sensor"], ["Motor driver", "L298N module"], ["Level", "Beginner to intermediate"]], "b": ["Arduino UNO board with USB cable", "Ultrasonic sensor", "Motor driver module", "2 x Gear motors and 2 x Wheels", "Chassis parts and caster", "Battery holder with AA cells", "Jumper wires, screws and screwdriver", "Contents as shown in the photo"]}, "4-Digit 7-Segment Display": {"d": "A 4-digit 7-segment LED display for clocks, counters, timers and meters. Easy to drive from an Arduino.", "s": [["Digits", "4"], ["Type", "7-segment LED"], ["Model", "CS3641BH (as marked)"], ["Use", "Clocks, counters and timers"]], "b": ["1 x 4-digit 7-segment display"]}, "Adjustable DC Power Supply": {"d": "A regulated DC power supply for testing and powering your circuits. Digital voltmeter and ammeter show the output, and you can set the voltage and current limit.", "s": [["Type", "DC regulated power supply"], ["Output", "0 to 30 V, 2 A"], ["Display", "Digital voltmeter and ammeter"], ["Indicators", "CV and CC lights"], ["Controls", "Voltage and current control knobs"]], "b": ["1 x DC regulated power supply"]}, "Arduino Nano Compatible Board": {"d": "A small Arduino Nano compatible board that fits on a breadboard. Same power as a UNO in a tiny size, good for compact projects.", "s": [["Type", "Nano compatible board"], ["Controller", "ATmega328P (as marked on chip)"], ["USB", "Mini-USB port"], ["Pins", "Header pins attached, breadboard friendly"]], "b": ["1 x Nano compatible board with header pins"]}, "Wire Stripper and Cutter Set": {"d": "A wire stripper and cutter for removing insulation and cutting thin wires in electronics work. Comfortable grip handles make it easy to use.", "s": [["Type", "Wire stripper and cutter"], ["Use", "Stripping and cutting electronics wires"], ["Handle", "Comfort grip"]], "b": ["1 x Wire stripper and cutter"]}, "Basic Electronics Learning Kit": {"d": "A starter kit with the basic parts every electronics learner needs. Build simple circuits, test them with the multimeter and learn how components work together.", "s": [["Level", "Beginner"], ["Good for", "School and college electronics practice"], ["Includes", "Meter, breadboard and common components"]], "b": ["Digital multimeter", "Breadboard", "Jumper wires", "Assorted LEDs", "Resistor assortment", "Capacitor assortment", "9V battery with clip", "Push buttons, transistors, LDR and ICs", "Contents as shown in the photo and may vary"]}, "2WD Robotics Car Kit for Students": {"d": "A two-wheel-drive robot car chassis kit. A good base for line followers, obstacle avoiders and other robot car projects with Arduino.", "s": [["Type", "2WD robot chassis kit"], ["Drive", "2 DC gear motors with wheels"], ["Power", "Battery holder for AA cells"], ["Level", "Beginner robotics"]], "b": ["Chassis plate", "2 x DC gear motors", "2 x Wheels", "Caster wheel", "Battery holder", "Speed encoder discs", "Screws, spacers and wires", "Contents as shown in the photo"]}, "Desoldering Pump": {"d": "A desoldering pump (solder sucker) to remove melted solder from a circuit board. Heat the joint, press the button and the pump pulls the solder away.", "s": [["Type", "Desoldering pump"], ["Body", "Aluminium barrel with spring plunger"], ["Use", "Removing solder and fixing mistakes"]], "b": ["1 x Desoldering pump"]}, "20x4 LCD Display with I2C Module": {"d": "A large 20x4 character LCD with an I2C module. Shows 4 lines of 20 characters, so you can display more information at once.", "s": [["Display", "20 characters x 4 lines"], ["Backlight", "Blue"], ["Interface", "I2C module attached"], ["Pins", "4 (GND, VCC, SDA, SCL)"]], "b": ["1 x 20x4 LCD with I2C module"]}, "ESP32 IoT Learning Kit": {"d": "A complete ESP32 learning kit for IoT projects. Build Wi-Fi connected projects with sensors, displays, relays and more, and learn with Arduino C or MicroPython.", "s": [["Board", "ESP32 with Wi-Fi"], ["Programming", "Arduino C and MicroPython (Thonny)"], ["Wireless", "Wi-Fi"], ["Level", "Beginner to intermediate"], ["Support", "Technical support available"]], "b": ["ESP32 board with expansion shield", "Display, sensor and relay modules", "Ultrasonic sensor, keypad and IR remote", "Servo and DC motor", "LEDs, resistors, buttons and jumper wires", "Battery holder and cable", "Contents as shown in the photo"]}, "LED Assortment Pack": {"d": "A box of 5 mm LEDs in different colours. Perfect for indicators, learning projects and Arduino practice.", "s": [["Size", "5 mm"], ["Colours", "Red, green, blue, yellow and white"], ["Box", "Compartment box"]], "b": ["1 x LED assortment box"]}, "Soldering Wire 50g": {"d": "Soldering wire for joining components and wires on a circuit board. Melts at a low temperature and leaves little residue for clean joints.", "s": [["Weight", "50 g spool"], ["Diameter", "0.8 mm"], ["Features", "Fast soldering, low melting point, less residue"]], "b": ["1 x Solder wire spool (50 g)"]}, "Simple Circuits Science Kit": {"d": "A simple science kit to learn how an electric circuit works. Connect the battery, bulb and switch to light the bulb, and see how a circuit opens and closes.", "s": [["Type", "Simple circuit science kit"], ["Concept", "Battery, bulb and switch"], ["Level", "School students, beginner"], ["Assembly", "Easy, no soldering"]], "b": ["Wooden base board", "Bulb with holder and a spare bulb", "9V battery", "Connecting wires", "Metal contacts and pin switch", "Contents as shown in the photo"]}, "16x2 LCD Display with I2C Module": {"d": "A 16x2 character LCD with an I2C backpack, so you only need 4 wires instead of 16. Blue backlight with white text, and a contrast knob on the I2C board.", "s": [["Display", "16 characters x 2 lines"], ["Backlight", "Blue"], ["Interface", "I2C module attached"], ["Pins", "4 (GND, VCC, SDA, SCL)"]], "b": ["1 x 16x2 LCD with I2C module"]}, "Resistor Assortment Kit": {"d": "A pack of metal film resistors in common values, supplied in strips. A must-have for every electronics project.", "s": [["Type", "Metal film resistors"], ["Pack", "Assorted values in paper strips"], ["Use", "LEDs, sensors and circuits"]], "b": ["1 x Resistor assortment pack"]}, "Capacitor Assortment Kit": {"d": "An assortment of ceramic disc capacitors in a handy organiser box with separate compartments for each value.", "s": [["Type", "Ceramic disc capacitors"], ["Box", "Organiser with 24 compartments (as shown)"], ["Use", "Filtering and decoupling in circuits"]], "b": ["1 x Capacitor assortment in organiser box"]}});
Object.assign(PIMG,{"Raspberry Pi Pico W (Wi-Fi)": "images/img80.webp", "SG90 Micro Servo Motor 9g": "images/img81.webp", "Bambu Lab H2S AMS Combo 3D Printer": "images/img82.webp"});Object.assign(PDET,{"Raspberry Pi Pico W (Wi-Fi)": {"d": "A small, low-cost microcontroller board from Raspberry Pi with built-in Wi-Fi. A great board for learning, IoT projects and connected gadgets. You can program it in MicroPython or C/C++.", "s": [["Chip", "RP2040, dual-core Arm Cortex-M0+"], ["Wireless", "2.4 GHz Wi-Fi"], ["GPIO", "26 multi-function pins"], ["Connector", "Micro-USB"], ["Programming", "MicroPython, C/C++"]], "b": ["1 x Raspberry Pi Pico W board (header pins as shown in the photo)"]}, "SG90 Micro Servo Motor 9g": {"d": "A tiny, lightweight servo motor for robots, RC models, robotic arms and Arduino projects. Easy to control with a single signal wire.", "s": [["Weight", "About 9 g"], ["Voltage", "4.8 V to 6 V"], ["Rotation", "About 180 degrees"], ["Wires", "3 (signal, power, ground)"], ["Use with", "Arduino, ESP32, Raspberry Pi and more"]], "b": ["1 x SG90 servo motor with 3-pin cable"]}, "Bambu Lab H2S AMS Combo 3D Printer": {"d": "A fully enclosed multi-colour 3D printer from Bambu Lab. The combo comes with the AMS filament system, so you can print with several colours and materials in one go.", "s": [["Type", "Enclosed 3D printer"], ["Multicolour", "AMS filament system (4 spools as shown)"], ["Screen", "Colour touchscreen"], ["Best for", "Prototypes, parts and multicolour models"]], "b": ["1 x Bambu Lab H2S printer", "1 x AMS unit (as shown in the photo)"]}});
PIMG["Goofoo RP700C 3D Printing Pen"]="images/img83.webp";PDET["Goofoo RP700C 3D Printing Pen"]={"d": "A handheld 3D printing pen for drawing in 3D. Use it for craft projects, models, prototypes and fun STEM activities. It has an LCD screen and buttons to control the pen.", "s": [["Type", "Handheld 3D printing pen"], ["Display", "LCD screen"], ["Controls", "Buttons for temperature and speed"], ["Best for", "Crafts, models and learning"]], "b": ["1 x 3D printing pen"]};
Object.assign(PIMG,{"Holybro Pixhawk 6C Flight Controller with PM02": "images/img84.webp", "Pluto 1.2 Educational Nano DIY Drone Kit": "images/img85.webp", "ACEBOTT QE035 IoT Smart Home Display Kit": "images/img86.webp", });Object.assign(PDET,{"Holybro Pixhawk 6C Flight Controller with PM02": {"d": "A flight controller from Holybro for building your own drone. It works with the PX4 and ArduPilot flight software and comes with the PM02 power module. The photo shows an example drone build.", "s": [["Processor", "STM32H743, 32-bit Arm Cortex-M7, 480 MHz"], ["Software", "PX4 and ArduPilot"], ["Power module", "PM02 included"], ["Best for", "Custom drone and robot builds"]], "b": ["1 x Pixhawk 6C flight controller", "1 x PM02 power module", "Drone frame, motors and propellers are not included"]}, "Pluto 1.2 Educational Nano DIY Drone Kit": {"d": "A build-it-yourself nano drone kit for learning. Assemble the frame and electronics, then fly it with the remote controller. A fun way for students to learn how drones work.", "s": [["Type", "Nano DIY drone kit"], ["Level", "Beginner, STEM learning"], ["Control", "Remote controller (as shown)"]], "b": ["Drone parts and frame", "Remote controller (as shown in photo)"]}, "ACEBOTT QE035 IoT Smart Home Display Kit": {"d": "A STEM education kit from ACEBOTT for building IoT and smart home projects. Students build wooden models and learn electronics, sensors and coding step by step.", "s": [["Type", "STEM education kit"], ["Topic", "IoT and smart home projects"], ["Level", "Learning, school and classroom use"]], "b": ["Wooden model parts", "Sensors and electronic modules", "Storage box (as shown in photo)"]}, });
Object.keys(D).forEach(function(k){D[k].forEach(function(p){OP[p[0]]=p[2];});});
document.querySelectorAll('.prod').forEach(function(p){
 var n=p.querySelector('h3').textContent,ph=p.querySelector('.ph');
 if(PIMG[n]){var im=document.createElement('img');im.alt=n;im.src=PIMG[n];var sv=ph.querySelector('svg');if(sv)sv.replaceWith(im);}
 function go(){location.hash='#p='+encodeURIComponent(n);window.scrollTo(0,0);}
 ph.style.cursor='pointer';ph.addEventListener('click',function(e){if(e.target.closest('.heart'))return;go();});
 var h=p.querySelector('h3');h.style.cursor='pointer';h.addEventListener('click',go);
});
function productGroup(n){
 var x=String(n).toLowerCase();
 if(/drone|pixhawk|quadcopter|flight controller/.test(x))return 'drones';
 if(/3d|bambu|printer|printing pen/.test(x))return '3d';
 if(/display|oled|lcd|tft|7-segment|dot matrix/.test(x))return 'displays';
 if(/solder|multimeter|wire stripper|pliers|screwdriver|vernier|power supply|flux|desoldering/.test(x))return 'tools';
 if(/kit|robot|makey|learning|solar/.test(x))return 'stem';
 return 'components';
}
function relatedFor(n){
 var g=productGroup(n),words=normRelated(n).split(' ').filter(function(x){return x.length>2});
 var all=[];Object.keys(D).forEach(function(k){(D[k]||[]).forEach(function(p){if(p[0]===n||all.some(function(x){return x.n===p[0]}))return;var ng=productGroup(p[0]),pw=normRelated(p[0]).split(' '),score=(ng===g?10:0)+relBoost(n,p[0]);words.forEach(function(w){if(pw.indexOf(w)>-1)score+=1});if(inStock(p[0]))all.push({n:p[0],p:p[1],o:p[2],score:score})})});
 all.sort(function(a,b){return b.score-a.score||a.n.localeCompare(b.n)});return all.slice(0,4);
}
function relBoost(a,b){var i=window.TLshop&&TLshop.info;if(!i)return 0;var x=i(a),y=i(b);if(!x||!y)return 0;return(x.cat===y.cat?6:0)+(x.sub&&x.sub===y.sub?8:0)}
function normRelated(x){return String(x).toLowerCase().replace(/wi-?fi/g,'wifi').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function showP(n){
 var pr=PR[n];if(pr===undefined){location.hash='';return}
 var op=OP[n],off=Math.round((op-pr)/op*100),de=PDET[n]||{d:'Full details for this product are coming soon. Message us on WhatsApp and we will share specifications and help you choose.',s:[],b:[]};
 var pd=$('pdp'),img=PIMG[n]?'<img alt="'+esc(n)+'" src="'+PIMG[n]+'" draggable="false">':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[/drone|pixhawk/i.test(n)?'drone':/3d|pen/i.test(n)?'print':/solder|multimeter|wire/i.test(n)?'tool':/display|oled|lcd|tft|segment/i.test(n)?'screen':/kit/i.test(n)?'kit':'chip']+'</svg>';
 var wm=encodeURIComponent('Hi Tinkerleaf, I have a question about: '+n+' (₹'+pr+')');
 pd.innerHTML='<div class="wrap pd"><a class="back" href="#products">‹ Back to shop</a><div class="pdg"><div class="zm" id="zm">'+img+(PIMG[n]?'<span class="hint">🔍 Hover to zoom</span>':'')+'</div><div class="pi"><h1>'+esc(n)+'</h1><div class="price">'+f(pr)+'<s>'+f(op)+'</s>'+(off>0?'<span class="save">'+off+'% off</span>':'')+'</div><div class="sti '+(inStock(n)?'in':'out')+'">'+(inStock(n)?'● In stock':'● Out of stock')+'</div><p>'+esc(de.d)+'</p><div class="pb"><button class="add" id="pa"'+(inStock(n)?'':' disabled')+'>'+(inStock(n)?'🛒 Add to cart':'Out of stock')+'</button><button class="w" id="pw"></button><a class="btn alt ow" target="_blank" rel="noopener" href="https://wa.me/'+WA+'?text='+wm+'">'+(inStock(n)?'💬 Ask on WhatsApp':'💬 Ask when back in stock')+'</a></div><div class="gn">🎫 Order materials worth ₹1000 or more and get a Project Guidance Card. Ask us anything about your project for 15 days.<br>🚚 Delivery all over India. <b>Free delivery on orders of '+rup(CFG.FREE_ABOVE)+' and above</b>, otherwise '+rup(CFG.SHIP)+'.<br>💵 Cash on Delivery and 📲 Online payment available.</div></div></div>'
 +((de.s.length||de.b.length)?'<div class="pdx"><div>'+(de.s.length?'<h2>Specifications</h2><table>'+de.s.map(function(r){return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td></tr>'}).join('')+'</table>':'')+'</div><div>'+(de.b.length?'<h2>What is in the box</h2><ul>'+de.b.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'')+'</div></div>':'')+'<div class="related"><div class="rhead"><div><h2>Related products</h2><p>More products that may work well with this one.</p></div><a href="#products">View all products</a></div><div class="related-grid">'+relatedFor(n).map(function(r){var im=PIMG[r.n]?'<img alt="'+esc(r.n)+'" loading="lazy" src="'+PIMG[r.n]+'">':ico(r.n,'');return '<article class="prod relprod"><div class="ph relph">'+im+'</div><h3>'+esc(r.n)+'</h3><div class="price">'+f(r.p)+'<s>'+f(r.o)+'</s></div><div class="act"><button class="add reladd" data-rel="'+esc(r.n)+'">🛒 Add to cart</button><a class="ow" href="#p='+encodeURIComponent(r.n)+'">View product</a></div></article>';}).join('')+'</div></div><section class="reviews" style="margin-top:28px"><div class="rhead"><div><h2>⭐ Customer reviews</h2><p id="reviewSummary">Loading reviews…</p></div></div><div id="reviewList"></div><div class="account-card" style="margin-top:16px"><h3 style="margin-top:0">Write a review</h3><p class="muted">Only customers who have received this product can submit a review.</p><div class="row"><select id="reviewRating"><option value="5">★★★★★ 5</option><option value="4">★★★★☆ 4</option><option value="3">★★★☆☆ 3</option><option value="2">★★☆☆☆ 2</option><option value="1">★☆☆☆☆ 1</option></select><button class="btn" id="reviewSubmit">Submit review</button></div><textarea id="reviewText" maxlength="1000" placeholder="Share your experience…" style="width:100%;margin-top:10px"></textarea><div id="reviewMsg" class="ce"></div></div></section></div>';
 function wl(){$('pw').textContent=wish.indexOf(n)>-1?'❤️ Saved':'🤍 Add to wishlist'}wl();
 $('pa').onclick=function(){addC(n)};$('pw').onclick=function(){togW(n);wl()};
 pd.querySelectorAll('[data-rel]').forEach(function(b){b.onclick=function(){addC(b.dataset.rel)}});
 pd.querySelectorAll('.relprod .relph').forEach(function(el){el.addEventListener('click',function(){var card=el.closest('.relprod'),h=card&&card.querySelector('h3');if(h)location.hash='#p='+encodeURIComponent(h.textContent)})});
 var z=$('zm');if(PIMG[n]){var im=z.querySelector('img');
  function mv(e){var r=z.getBoundingClientRect();im.style.transformOrigin=((e.clientX-r.left)/r.width*100)+'% '+((e.clientY-r.top)/r.height*100)+'%'}
  z.addEventListener('mouseenter',function(e){z.classList.add('on');mv(e)});z.addEventListener('mousemove',mv);z.addEventListener('mouseleave',function(){z.classList.remove('on')});
  z.addEventListener('touchstart',function(e){z.classList.toggle('on');},{passive:true});
  z.addEventListener('touchmove',function(e){if(z.classList.contains('on')){mv(e.touches[0]);e.preventDefault()}},{passive:false});}
 $('top').style.display='none';pd.hidden=false;document.title=n+' – Tinkerleaf';loadReviews(n);try{enhanceP(n)}catch(err){}}
function loadReviews(n){apiJSON('/api/reviews?product='+encodeURIComponent(n)).then(function(r){ratingUI(r);var sm=$('reviewSummary'),list=$('reviewList');if(sm)sm.textContent=r.summary.count?(r.summary.average.toFixed(1)+' / 5 · '+r.summary.count+' review'+(r.summary.count===1?'':'s')):'No reviews yet';if(list)list.innerHTML=r.reviews.length?r.reviews.map(function(x){return '<div class="account-card" style="margin:10px 0"><div><b>'+esc(x.userName)+'</b> <span class="badge">'+('★'.repeat(x.rating))+'</span> '+(x.verifiedPurchase?'<small class="muted">Verified purchase</small>':'')+'</div><p style="margin-bottom:0">'+esc(x.text)+'</p><small class="muted">'+new Date(x.createdAt).toLocaleDateString('en-IN')+'</small></div>';}).join(''):'<div class="empty">Be the first to review this product.</div>';var btn=$('reviewSubmit');if(btn)btn.onclick=function(){if(!account){accountModal('create');toast('👤 Please sign in to review this product.');return}var text=$('reviewText').value.trim(),rating=Number($('reviewRating').value);if(text.length<3){$('reviewMsg').textContent='Write at least 3 characters.';return}btn.disabled=true;apiJSON('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productName:n,rating,text})}).then(function(){$('reviewMsg').textContent='';$('reviewText').value='';toast('⭐ Review saved');loadReviews(n)}).catch(function(e){$('reviewMsg').textContent='⚠️ '+e.message}).finally(function(){btn.disabled=false})};}).catch(function(){var sm=$('reviewSummary');if(sm)sm.textContent='Reviews unavailable right now.';var pr=$('pRate');if(pr)pr.textContent='☆ Reviews unavailable'});}

/* ===================== Product page extras ===================== */
/* More photos per product: PIMGS["Exact product name"]=["images/a.webp","images/b.webp"]; the first photo is still PIMG[name]. */
var PIMGS={};
/* Delivery estimate (working days, Sundays skipped). Dispatch: next working day. Change the numbers to match your courier. */
var DELIVERY={dispatch:1,local:[2,3],metro:[3,5],rest:[4,7],unknown:[3,6]};
var FBT_RULES=[[/solder|flux|desolder|helping hands/i,['Soldering Wire 50g','Soldering Flux Paste','Helping Hands Soldering Stand']],[/multimeter/i,['Needle Nose Pliers','Wire Stripper and Cutter Set']],
 [/oled|lcd|tft|segment|dot matrix/i,['Arduino UNO R3 Compatible Board','Jumper Wires Pack of 120']],[/sensor|hc-sr04|dht|relay|l298n|servo/i,['Arduino UNO R3 Compatible Board','Jumper Wires Pack of 120']],
 [/esp32|nodemcu|xiao|pico|raspberry/i,['Jumper Wires Pack of 120','0.96 inch I2C OLED Display']],[/arduino|nano/i,['Jumper Wires Pack of 120','LED Assortment Pack']],
 [/resistor|capacitor|led assortment/i,['Jumper Wires Pack of 120','Arduino UNO R3 Compatible Board']],[/drone/i,['Needle Nose Pliers','Precision Screwdriver Set']],[/3d|bambu/i,['Precision Screwdriver Set','Needle Nose Pliers']],
 [/kit|robot/i,['Jumper Wires Pack of 120','Precision Screwdriver Set']]];
function fbtFor(n){var l=['Jumper Wires Pack of 120','Digital Multimeter'];for(var i=0;i<FBT_RULES.length;i++)if(FBT_RULES[i][0].test(n)){l=FBT_RULES[i][1];break}
 return l.filter(function(x){return x!==n&&PR[x]!==undefined&&inStock(x)}).slice(0,2)}
function addBiz(d,k){d=new Date(d);while(k>0){d.setDate(d.getDate()+1);if(d.getDay()!==0)k--}return d}
function etaText(pin){var p=String(pin||'').replace(/\D/g,''),r=DELIVERY.unknown,place='';
 if(p.length===6){if(/^3[6-9]/.test(p)){r=DELIVERY.local;place='Gujarat'}else if(/^(11|40|41|50|56|60|70)/.test(p)){r=DELIVERY.metro}else r=DELIVERY.rest}
 var fm=function(d){return d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})},a=addBiz(new Date(),DELIVERY.dispatch+r[0]),b=addBiz(new Date(),DELIVERY.dispatch+r[1]);
 return '<b>'+fm(a)+' – '+fm(b)+'</b>'+(p.length===6?' to PIN '+p:' (enter PIN code for a closer date)')+'<small>Dispatched within '+DELIVERY.dispatch+' working day. Estimate only; remote areas can take longer.</small>'}
function starsStr(a){var r=Math.round(a);return '★'.repeat(r)+'☆'.repeat(5-r)}
function ratingUI(r){var sm=r&&r.summary||{count:0,average:0},d=r.distribution||{};
 if(!r.distribution&&r.reviews)r.reviews.forEach(function(x){d[x.rating]=(d[x.rating]||0)+1});
 var top=$('pRate');if(top)top.innerHTML=sm.count?'<span class="stars">'+starsStr(sm.average)+'</span> <b>'+sm.average.toFixed(1)+'</b> · '+sm.count+' review'+(sm.count===1?'':'s'):'☆ No reviews yet';
 var box=$('ratingBox');if(!box)return;if(!sm.count){box.innerHTML='';return}
 box.innerHTML='<div class="rbox"><div class="rbig"><b>'+sm.average.toFixed(1)+'</b><span class="stars">'+starsStr(sm.average)+'</span><small>'+sm.count+' review'+(sm.count===1?'':'s')+'</small></div><div class="rbars">'
  +[5,4,3,2,1].map(function(k){var c=d[k]||0,pc=Math.round(c/sm.count*100);return '<div class="rbr"><span>'+k+' ★</span><i><u style="width:'+pc+'%"></u></i><span>'+c+'</span></div>'}).join('')+'</div></div>'}
function enhanceP(n){
 var pd=$('pdp'),pi=pd&&pd.querySelector('.pi'),zm=$('zm');if(!pi||!zm)return;
 var info=window.TLshop&&TLshop.info&&TLshop.info(n),back=pd.querySelector('.back'),isIn=inStock(n),q=serverStock[n];
 /* breadcrumb */
 if(back){var bc='<nav class="crumbs" aria-label="Breadcrumb"><a href="#top">Home</a> › <a href="#products">Shop</a>';
  if(info&&info.cat){bc+=' › <a href="#cat='+info.cat+'">'+esc(info.catLabel)+'</a>';if(info.sub)bc+=' › <a href="#cat='+info.cat+'/'+info.sub+'">'+esc(info.subLabel)+'</a>'}
  back.outerHTML=bc+'</nav>'}
 /* rating line under the title + rating box above the reviews */
 var h1=pi.querySelector('h1');h1.insertAdjacentHTML('afterend','<button type="button" class="prate" id="pRate">☆ Loading reviews…</button>');
 $('pRate').onclick=function(){var rv=pd.querySelector('.reviews');if(rv)rv.scrollIntoView({behavior:'smooth',block:'start'})};
 var rl=$('reviewList');if(rl)rl.insertAdjacentHTML('beforebegin','<div id="ratingBox"></div>');
 /* stock status */
 var st=pi.querySelector('.sti');if(st){if(isIn&&q>0&&q<=5){st.textContent='● Only '+q+' left in stock';st.classList.add('low')}else if(isIn)st.textContent='● In stock · ready to ship';else st.textContent='● Out of stock · ask us on WhatsApp for restock date'}
 /* share button + delivery box */
 var pb=pi.querySelector('.pb');
 if(pb)pb.insertAdjacentHTML('beforeend','<button type="button" class="w" id="pshare">🔗 Share</button>');
 if(pb)pb.insertAdjacentHTML('afterend','<div class="dlv"><b>🚚 Estimated delivery</b><div class="dlvr"><input id="dPin" inputmode="numeric" maxlength="6" placeholder="PIN code" aria-label="Delivery PIN code" value="'+esc(ld('tl_pin',''))+'"><button type="button" id="dGo">Check</button></div><div id="dOut" class="dout"></div></div>');
 function eta(){var p=$('dPin').value.replace(/\D/g,'');if(p&&p.length!==6){$('dOut').textContent='Enter a valid 6-digit PIN code.';return}if(p)sv('tl_pin',p);$('dOut').innerHTML=isIn?etaText(p):'Delivery date will be shown once this product is back in stock.'}
 $('dGo').onclick=eta;$('dPin').addEventListener('keydown',function(e){if(e.key==='Enter')eta()});eta();
 $('pshare').onclick=function(){var url=location.origin+location.pathname+'#p='+encodeURIComponent(n);
  if(navigator.share){navigator.share({title:n,text:'Check out '+n+' on Tinkerleaf',url:url}).catch(function(){});return}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(function(){toast('🔗 Product link copied')},function(){window.prompt('Copy this link',url)});else window.prompt('Copy this link',url)};
 /* extra photos */
 var imgs=[PIMG[n]].concat(PIMGS[n]||[]).filter(Boolean);
 if(imgs.length>1){var col=document.createElement('div');col.className='pgal';zm.parentNode.insertBefore(col,zm);col.appendChild(zm);
  var th=document.createElement('div');th.className='thumbs';th.innerHTML=imgs.map(function(u,i){return '<button type="button" class="'+(i?'':'on')+'" data-i="'+i+'" aria-label="Photo '+(i+1)+'"><img alt="" src="'+u+'"></button>'}).join('');col.appendChild(th);
  th.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;zm.querySelector('img').src=imgs[+b.dataset.i];zm.classList.remove('on');Array.prototype.forEach.call(th.children,function(x){x.classList.toggle('on',x===b)})})}
 /* frequently bought together */
 var fb=fbtFor(n),pg=pd.querySelector('.pdg');
 if(fb.length&&pg&&isIn){var list=[n].concat(fb);
  pg.insertAdjacentHTML('afterend','<section class="fbt"><h2>Frequently bought together</h2><div class="fbr">'+list.map(function(x,i){var im=PIMG[x]?'<img alt="" loading="lazy" src="'+PIMG[x]+'">':ico(x,'');
   return (i?'<span class="fbp">+</span>':'')+'<label class="fbi"><input type="checkbox" '+(i?'checked':'checked disabled')+' data-n="'+esc(x)+'"><span class="fbph">'+im+'</span><span class="fbn">'+(i?'':'<em>This item: </em>')+esc(x)+'</span><span class="fbpr">'+f(PR[x])+'</span></label>'}).join('')
   +'</div><div class="fbt2"><span>Total for <b id="fbN"></b> items: <b id="fbT"></b></span><button type="button" class="add" id="fbAdd">🛒 Add selected to cart</button></div></section>');
  var fbs=pd.querySelector('.fbt');function fbu(){var on=Array.prototype.filter.call(fbs.querySelectorAll('input'),function(i){return i.checked});$('fbN').textContent=on.length;$('fbT').textContent=f(on.reduce(function(a,i){return a+PR[i.dataset.n]},0))}
  fbs.addEventListener('change',fbu);fbu();
  $('fbAdd').onclick=function(){Array.prototype.forEach.call(fbs.querySelectorAll('input:checked'),function(i){addC(i.dataset.n)})}}
 /* product details table: brand / category / availability (added to the specifications table if there is one) */
 if(info){var rows=[];if(info.brand&&info.brand!=='Other')rows.push(['Brand',info.brand]);rows.push(['Category',info.catLabel+(info.sub?' › '+info.subLabel:'')]);rows.push(['Availability',isIn?'In stock':'Out of stock']);
  var tr=rows.map(function(r){return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td></tr>'}).join(''),tb=pd.querySelector('.pdx table');
  if(tb)tb.insertAdjacentHTML('beforeend',tr);else{var rel=pd.querySelector('.related');if(rel)rel.insertAdjacentHTML('beforebegin','<div class="pdx"><div><h2>Product details</h2><table>'+tr+'</table></div></div>')}}
}
function route(){var m=location.hash.match(/^#p=(.+)$/);
 if(m){showP(decodeURIComponent(m[1]));window.scrollTo(0,0);return}var g=location.hash.match(/^#pg=(about|contact|privacy|policy|terms|quote|projects|post1|post2|post3|orders|track)(?:\/([^\/]+))?$/);if(g){showPage(g[1],g[2]?decodeURIComponent(g[2]):'');window.scrollTo(0,0);return}
 $('pdp').hidden=true;$('top').style.display='';document.title='Tinkerleaf – Electronic components with project guidance';
 var cm=location.hash.match(/^#cat=([\w,]+)(?:\/([\w-]+))?$/);if(cm&&window.TLshop){TLshop.setCat(cm[1],{scroll:true,sub:cm[2]||''});return}
 var id=location.hash.slice(1),el=id&&document.getElementById(id);if(el)el.scrollIntoView();}
window.addEventListener('hashchange',route);
$('nl').onclick=function(){$('g-new').scrollBy({left:-300,behavior:'smooth'})};$('nr').onclick=function(){$('g-new').scrollBy({left:300,behavior:'smooth'})};
var MM={cat:[['🔌 Components','#cat=components'],['📡 Boards &amp; Modules','#cat=boards'],['🎛️ Sensors','#cat=components/sensors'],['🛠️ Tools &amp; Instruments','#cat=tools'],['🖥️ Displays','#cat=displays'],['🚁 Drones','#cat=drones'],['🖨️ 3D Printing','#cat=3d'],['🎓 STEM Kits','#cat=stem']],orders:[['📦 My orders','#pg=orders'],['🚚 Track an order','#pg=track']],brand:[['Arduino','#brands'],['Raspberry Pi','#brands'],['BBC micro:bit','#brands'],['DFRobot','#brands'],['Seeed Studio','#brands'],['Waveshare','#brands']]};
var mm=$('mm'),mt=null;
function closeM(){mm.classList.remove('on','br');if(mt)mt.setAttribute('aria-expanded','false');mt=null}
document.querySelectorAll('.nt').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();
 if(mt===b){closeM();return}closeM();mt=b;b.setAttribute('aria-expanded','true');
 mm.innerHTML=MM[b.dataset.m].map(function(x){return '<a role="menuitem" href="'+x[1]+'">'+x[0]+'</a>'}).join('');
 mm.className='mm on'+(b.dataset.m==='brand'?' br':'');
 var r=b.getBoundingClientRect(),w=mm.offsetWidth;mm.style.top=(r.bottom+6)+'px';mm.style.left=Math.max(12,Math.min(r.left,window.innerWidth-w-12))+'px';});});
mm.addEventListener('click',closeM);document.addEventListener('click',closeM);window.addEventListener('scroll',closeM,{passive:true});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});
var STAG={"Basic Electronics Learning Kit": "school", "3 In 1 Educational DIY Solar Robot Kit": "school science robotic", "Official Makey Makey Classic Invention Kit for STEM": "school college", "2WD Robotics Car Kit for Students": "robotic school", "Obstacle Avoiding Robot Kit": "robotic college", "Arduino UNO Starter Kit for Beginners": "college", "ESP32 IoT Learning Kit": "college", "Simple Circuits Science Kit": "science school", "Mini DIY Drone Kit for Beginners": "drone", "DIY Drone Learning Kit with Camera": "drone"};
document.querySelectorAll('#g-stem .prod').forEach(function(p){var n=p.querySelector('h3').textContent,pr=PR[n],op=OP[n];
 var b=document.createElement('span');b.className='sale';b.textContent='Sale '+Math.round((op-pr)/op*100)+'%';p.insertBefore(b,p.firstChild);
 p.querySelector('.price').insertAdjacentHTML('afterend','<div class="sv">Save ₹'+(op-pr).toLocaleString('en-IN')+'</div>');});
$('tabs').addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;
 $('tabs').querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===t)});
 document.querySelectorAll('#g-stem .prod').forEach(function(p){var n=p.querySelector('h3').textContent;p.style.display=(t.dataset.t==='all'||(STAG[n]||'').split(' ').indexOf(t.dataset.t)>-1)?'':'none';});
 $('g-stem').scrollTo({left:0});});
$('sl').onclick=function(){$('g-stem').scrollBy({left:-500,behavior:'smooth'})};$('sr').onclick=function(){$('g-stem').scrollBy({left:500,behavior:'smooth'})};
var TTAG={"Digital Multimeter": "test", "Soldering Wire 50g": "solder", "Wire Stripper and Cutter Set": "hand", "Helping Hands Soldering Stand": "solder hand", "Soldering Flux Paste": "solder", "Desoldering Pump": "solder", "Needle Nose Pliers": "hand", "Precision Screwdriver Set": "hand", "Digital Vernier Caliper": "test", "Adjustable DC Power Supply": "power"};
document.querySelectorAll('#g-tools .prod').forEach(function(p){var n=p.querySelector('h3').textContent,pr=PR[n],op=OP[n];
 var b=document.createElement('span');b.className='sale';b.textContent='Sale '+Math.round((op-pr)/op*100)+'%';p.insertBefore(b,p.firstChild);
 p.querySelector('.price').insertAdjacentHTML('afterend','<div class="sv">Save ₹'+(op-pr).toLocaleString('en-IN')+'</div>');});
$('tabs2').addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;
 $('tabs2').querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===t)});
 document.querySelectorAll('#g-tools .prod').forEach(function(p){var n=p.querySelector('h3').textContent;p.style.display=(t.dataset.t==='all'||(TTAG[n]||'').split(' ').indexOf(t.dataset.t)>-1)?'':'none';});
 $('g-tools').scrollTo({left:0});});
$('tl').onclick=function(){$('g-tools').scrollBy({left:-500,behavior:'smooth'})};$('tr').onclick=function(){$('g-tools').scrollBy({left:500,behavior:'smooth'})};
var CTAG={"Arduino UNO R3 Compatible Board": "board", "NodeMCU ESP8266 WiFi Board": "board", "Arduino Nano Compatible Board": "board", "Jumper Wires Pack of 120": "wire", "Resistor Assortment Kit": "passive", "Capacitor Assortment Kit": "passive", "LED Assortment Pack": "passive", "5V Relay Module 1 Channel": "module", "L298N Motor Driver Module": "module", "HC-SR04 Ultrasonic Sensor": "module", "DHT11 Temperature and Humidity Sensor": "module"};
document.querySelectorAll('#g-components .prod').forEach(function(p){var n=p.querySelector('h3').textContent,pr=PR[n],op=OP[n];
 var b=document.createElement('span');b.className='sale';b.textContent='Sale '+Math.round((op-pr)/op*100)+'%';p.insertBefore(b,p.firstChild);
 p.querySelector('.price').insertAdjacentHTML('afterend','<div class="sv">Save ₹'+(op-pr).toLocaleString('en-IN')+'</div>');});
$('tabs3').addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;
 $('tabs3').querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===t)});
 document.querySelectorAll('#g-components .prod').forEach(function(p){var n=p.querySelector('h3').textContent;p.style.display=(t.dataset.t==='all'||(CTAG[n]||'').split(' ').indexOf(t.dataset.t)>-1)?'':'none';});
 $('g-components').scrollTo({left:0});});
$('cl').onclick=function(){$('g-components').scrollBy({left:-500,behavior:'smooth'})};$('cr').onclick=function(){$('g-components').scrollBy({left:500,behavior:'smooth'})};
var DTAG={"0.96 inch I2C OLED Display": "oled", "1.3 inch I2C OLED Display": "oled", "16x2 LCD Display with I2C Module": "lcd", "20x4 LCD Display with I2C Module": "lcd", "2.4 inch TFT Display Module": "tft", "1.8 inch SPI TFT Display": "tft", "3.5 inch TFT Touch Display Shield": "tft", "4-Digit 7-Segment Display": "led", "8x8 LED Dot Matrix Display": "led"};
document.querySelectorAll('#g-displays .prod').forEach(function(p){var n=p.querySelector('h3').textContent,pr=PR[n],op=OP[n];
 var b=document.createElement('span');b.className='sale';b.textContent='Sale '+Math.round((op-pr)/op*100)+'%';p.insertBefore(b,p.firstChild);
 p.querySelector('.price').insertAdjacentHTML('afterend','<div class="sv">Save ₹'+(op-pr).toLocaleString('en-IN')+'</div>');});
$('tabs4').addEventListener('click',function(e){var t=e.target.closest('button');if(!t)return;
 $('tabs4').querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===t)});
 document.querySelectorAll('#g-displays .prod').forEach(function(p){var n=p.querySelector('h3').textContent;p.style.display=(t.dataset.t==='all'||(DTAG[n]||'').split(' ').indexOf(t.dataset.t)>-1)?'':'none';});
 $('g-displays').scrollTo({left:0});});
$('dl').onclick=function(){$('g-displays').scrollBy({left:-500,behavior:'smooth'})};$('dr2').onclick=function(){$('g-displays').scrollBy({left:500,behavior:'smooth'})};
document.querySelectorAll('.bd').forEach(function(c){var b=c.dataset.b.toLowerCase(),n=0;
 document.querySelectorAll('.prod').forEach(function(p){if(p.textContent.toLowerCase().indexOf(b)>-1)n++});
 c.querySelector('em').textContent=n?(n+(n>1?' products':' product')+' ›'):'Ask us ›';c.dataset.n=n;
 c.addEventListener('click',function(e){e.preventDefault();
  if(!+c.dataset.n){window.open('https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Tinkerleaf, do you have '+c.dataset.b+' products?'),'_blank');return}
  $('q').value=c.dataset.b;$('srch').dispatchEvent(new Event('submit',{cancelable:true}));toast('Showing '+c.dataset.b+' products. Clear the search to see all.');});});
var BIMG={};
document.querySelectorAll('.bx').forEach(function(c){var n=c.dataset.b,b=n.toLowerCase(),k=0;
 if(BIMG[n])c.innerHTML='<img alt="'+esc(n)+'" src="'+BIMG[n]+'">';
 document.querySelectorAll('.prod').forEach(function(p){if(p.textContent.toLowerCase().indexOf(b)>-1)k++});
 c.title=k?k+' product'+(k>1?'s':''):'Ask us about '+n;
 c.addEventListener('click',function(e){e.preventDefault();
  if(!k){window.open('https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Tinkerleaf, do you have '+n+' products?'),'_blank');return}
  $('q').value=n;$('srch').dispatchEvent(new Event('submit',{cancelable:true}));toast('Showing '+n+' products. Clear the search to see all.');});});
MM.brand=['Arduino','Raspberry Pi','Bambu Lab','Holybro','Goofoo','Pluto','Snapmaker','M5Stack'].map(function(x){return [x,'#brands']});
$('nbt').onclick=function(){var m=$('nem').value.trim();if(!/^\S+@\S+\.\S+$/.test(m)){toast('⚠️ Enter a valid email address');$('nem').focus();return}
 var f=document.querySelector('.nlf');f.innerHTML='<div class="nlok">✅ Almost done! Tap one to confirm <b>'+esc(m)+'</b><div class="row"><a class="btn alt" target="_blank" rel="noopener" href="https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Tinkerleaf, please add this email to your newsletter: '+m)+'">💬 Confirm on WhatsApp</a><a class="btn" href="mailto:babliamisha@gmail.com?subject='+encodeURIComponent('Newsletter signup')+'&body='+encodeURIComponent('Please add this email to your newsletter: '+m)+'">✉️ Confirm by email</a></div></div>'};
$('nem').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();$('nbt').click()}});
var UPI_ID='sakshipardeshi705@oksbi',UPI_NAME='Sakshi Pardeshi',UPI_QR='images/img87.webp';
var lastOrder=null;
function rup(n){return '₹'+n.toLocaleString('en-IN')}
function loadCheckoutAddresses(){
 if(!account)return;apiJSON('/api/addresses').then(function(list){var box=$('savedAddressBox');if(!box)return; if(!list.length){box.innerHTML='📍 No saved addresses yet. Tick <b>Save this address</b> below to add one.';return;} box.innerHTML='<label class="l" for="savedAddressSelect">Saved address</label><select id="savedAddressSelect" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:10px"><option value="">Select a saved address…</option>'+list.map(function(a,i){return '<option value="'+i+'">'+esc(a.label||'Address '+(i+1))+' — '+esc(a.address)+', '+esc(a.city)+' '+esc(a.pin)+'</option>'}).join('')+'</select>';var sel=$('savedAddressSelect');sel.onchange=function(){if(sel.value==='')return;var a=list[Number(sel.value)];$('c1').value=a.name||'';$('c2').value=a.phone||'';$('c3').value=a.address||'';$('c4').value=a.city||'';$('c5').value=a.pin||''};}).catch(function(){var box=$('savedAddressBox');if(box)box.textContent='Could not load saved addresses.'});
}
function saveAddress(a){apiJSON('/api/addresses',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(a)}).then(function(){toast('📍 Address saved')}).catch(function(e){toast('⚠️ Address was not saved: '+e.message)})}
function loadAddressesView(){
 if(!account){accountModal('create');return}apiJSON('/api/addresses').then(function(list){var b=$('db'),h='<div class="note">Saved addresses are securely linked to your Tinkerleaf account.</div>';h+=list.length?list.map(function(a,i){return '<div class="account-card" style="margin:10px 0"><b>'+esc(a.label||'Address '+(i+1))+'</b><span>'+esc(a.name)+' • '+esc(a.phone)+'</span><span>'+esc(a.address)+', '+esc(a.city)+' - '+esc(a.pin)+'</span><button class="rm" data-deladdr="'+i+'" style="margin-top:8px">Remove</button></div>'}).join(''):'<div class="empty">No saved addresses yet.</div>';h+='<button class="btn" data-a="checkout" style="margin-top:10px">＋ Add address during checkout</button>';b.innerHTML=h;b.scrollTop=0;}).catch(function(e){$('db').innerHTML='<div class="ce">'+esc(e.message)+'</div>'});
}
function orderStatusLabel(s){return ({placed:'Order placed',confirmed:'Confirmed',packed:'Packed',shipped:'Shipped',delivered:'Delivered',cancelled:'Cancelled'})[s]||s}
function checkoutHTML(){var ks=Object.keys(cart),T=total(),S=shipFor(T),u=guest||{};
 var h='<div class="cf"><a href="#" data-a="back" class="lnk" style="text-align:left;margin:0 0 6px">‹ Back to cart</a>';
 h+='<h4>📦 Delivery details</h4><div id="savedAddressBox" class="note">Loading saved addresses…</div>'; 
 h+='<label class="l" for="c1">👤 Full name</label><input id="c1" autocomplete="name" value="'+esc(u.name||'')+'">';
 h+='<label class="l" for="c2">📱 Phone number</label><input id="c2" type="tel" autocomplete="tel" value="'+esc(u.phone||'')+'">';
 h+='<label class="l" for="c3">🏠 Address</label><textarea id="c3" autocomplete="street-address" placeholder="House no, street, area">'+esc(u.address||'')+'</textarea>';
 h+='<label class="l" for="c4">🏙️ City</label><input id="c4" autocomplete="address-level2" value="'+esc(u.city||'')+'">';
 h+='<label class="l" for="c5">📮 Pincode</label><div class="row" style="gap:8px;align-items:stretch"><input id="c5" inputmode="numeric" maxlength="6" autocomplete="postal-code" value="'+esc(u.pin||'')+'" style="flex:1"><button type="button" class="btn alt" id="checkPin">Check delivery</button></div><div id="pinResult" class="note" style="margin-top:6px">Check your pincode before placing your order.</div>';
 h+='<label class="l" for="c6">📧 Email (optional)</label><input id="c6" type="email" autocomplete="email" placeholder="For order updates" value="'+esc(u.email||'')+'">';
 h+='<details class="gstd"'+(u.gstin?' open':'')+'><summary>🧾 Need a GST invoice? (optional)</summary><label class="l" for="c7">🏢 Business / institution name</label><input id="c7" autocomplete="organization" value="'+esc(u.biz||'')+'"><label class="l" for="c8">GSTIN</label><input id="c8" maxlength="15" autocapitalize="characters" placeholder="e.g. 24ABCDE1234F1Z5" value="'+esc(u.gstin||'')+'"></details>';
 h+='<label class="pmo" style="margin-top:8px"><input type="checkbox" id="saveAddress"><span><b>📍 Save this address</b><small>Use it quickly next time.</small></span></label>';
 h+='<h4>💳 Payment method</h4>';
 h+='<label class="pmo"><input type="radio" name="pm" value="cod" checked><span><b>💵 Cash on Delivery</b><small>Pay in cash when your order arrives.</small></span></label>';
 if(CFG.RZP_KEY)h+='<label class="pmo"><input type="radio" name="pm" value="online"><span><b>📲 Online payment</b><small>Pay securely with UPI, cards or net banking (Razorpay). Your order is placed right after the payment succeeds.</small></span></label>';else h+='<div class="note">📲 Online payment is temporarily unavailable. Cash on Delivery is available.</div>';
 h+='<h4>🧾 Order summary</h4>'+ks.map(function(n){return '<div class="cs"><span>'+esc(n)+' × '+cart[n]+'</span><span>'+rup(cart[n]*(PR[n]||0))+'</span></div>'}).join('');
 h+='<div class="cs"><span>Subtotal</span><span>'+rup(T)+'</span></div><div class="cs"><span>Delivery</span><span>'+(S?rup(S):'FREE')+'</span></div><div class="cs t"><span>Total</span><span>'+rup(T+S)+'</span></div>';
 h+='<div class="note">🚚 '+(S?'Delivery charge: <b>'+rup(S)+'</b>. Orders of '+rup(CFG.FREE_ABOVE)+' and above get <b>free delivery</b>.':'You get <b>free delivery</b> on this order.')+' We deliver all over India. See our <a href="#pg=policy" data-a="x">Return, Refund &amp; Delivery Policy</a>. A bill / invoice is provided with every order.</div>';
 h+='<div class="ce" id="ce" role="alert"></div><button class="btn" id="plc" data-a="place" style="display:block;width:100%;border:0;cursor:pointer;font:inherit;font-weight:600">✅ Place order</button><div class="note" style="margin-top:12px;font-size:.85rem">By placing your order you agree to our <a href="#pg=terms" data-a="x">Terms &amp; Conditions</a>.</div></div>';
 return h}
function checkDeliveryPin(){
 var pin=$('c5')?.value.trim(),out=$('pinResult');
 if(!out)return false;
 out.textContent='Checking…';
 return fetch('/api/delivery/check/'+encodeURIComponent(pin)).then(function(r){return r.json().then(function(x){return {ok:r.ok,data:x}})}).then(function(r){
   if(!r.ok)throw new Error(r.data.error||'Could not check delivery');
   out.textContent=(r.data.serviceable?'✅ ':'❌ ')+r.data.message;
   out.dataset.serviceable=r.data.serviceable?'yes':'no';
   return r.data.serviceable;
 }).catch(function(e){out.textContent='⚠️ '+e.message;out.dataset.serviceable='no';return false});
}
function placeOrder(){if(!account){accountModal('create');toast('👤 Please create an account or sign in before placing your order.');return}var g=function(i){return $(i).value.trim()},er=$('ce');
 var n=g('c1'),ph=g('c2'),ad=g('c3'),ct=g('c4'),pn=g('c5'),pm=document.querySelector('input[name="pm"]:checked').value,em=g('c6'),biz=g('c7'),gst=g('c8').toUpperCase();
 if(em&&!/^\S+@\S+\.\S+$/.test(em)){er.textContent='⚠️ Enter a valid email or leave it blank.';return}
 if(gst&&!/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst)){er.textContent='⚠️ Enter a valid 15-character GSTIN or leave it blank.';return}
 if(gst&&!biz){er.textContent='⚠️ Enter the business name for the GST invoice.';return}
 if(!n){er.textContent='⚠️ Enter your name.';return}
 if(!/^[0-9+\s-]{10,15}$/.test(ph)){er.textContent='⚠️ Enter a valid phone number.';return}
 if(ad.length<8){er.textContent='⚠️ Enter your full address.';return}
 if(!ct){er.textContent='⚠️ Enter your city.';return}
 if(!/^\d{6}$/.test(pn)){er.textContent='⚠️ Enter a valid 6-digit pincode.';return}
 if($('pinResult')&&$('pinResult').dataset.serviceable!=='yes'){er.textContent='⚠️ Please check delivery availability for your pincode first.';checkDeliveryPin();return}
 if(!Object.keys(cart).length){er.textContent='⚠️ Your cart is empty.';return}
 var oo=Object.keys(cart).filter(function(k){return !inStock(k)});
 if(oo.length){oo.forEach(function(k){delete cart[k]});upd();toast('⚠️ Out of stock, removed from cart: '+oo.join(', '));show('cart');return}
 var T=total(),S=shipFor(T),id='TL'+String(Date.now()).slice(-8);
 if($('saveAddress')&&$('saveAddress').checked) saveAddress({label:'Home',name:n,phone:ph,address:ad,city:ct,pin:pn});
 var paymentKey=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():('tl-'+Date.now()+'-'+Math.random().toString(36).slice(2));
 var o={id:id,paymentKey:paymentKey,items:JSON.parse(JSON.stringify(cart)),sub:T,ship:S,total:T+S,name:n,phone:ph,address:ad,city:ct,pin:pn,pm:pm,ts:Date.now(),email:em,biz:biz,gstin:gst};
 lastOrder=o;
 /* Online payment: pehle QR/payment screen. WhatsApp tab tak nahi khulega jab tak payment confirm na ho. */
 var pb0=$('plc');if(pb0){pb0.disabled=true;pb0.textContent='⏳ Checking your cart…'}
 var unlock=function(){var b=$('plc');if(b){b.disabled=false;payBtnLabel()}};
 flushCartServer().then(function(){
  if(pm==='online'){if(CFG.RZP_KEY){payRzp(o);return}unlock();er.textContent='⚠️ Online payment is not available right now. Please choose Cash on Delivery.';return}
  finishOrder(o)
 }).catch(function(e){unlock();er.textContent='⚠️ '+e.message})}
/* ---- Razorpay Checkout ---- */
function loadRzp(ok,fail){if(window.Razorpay)return ok();var sc=document.createElement('script');sc.src='https://checkout.razorpay.com/v1/checkout.js';sc.onload=ok;sc.onerror=fail;document.head.appendChild(sc)}
function payRzp(o){var b=$('plc'),er=$('ce'),reset=function(){if(b){b.disabled=false;payBtnLabel()}};
 b.disabled=true;b.textContent='⏳ Preparing secure payment…';er.textContent='';
 apiJSON('/api/payments/razorpay/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({receipt:o.id,idempotencyKey:o.paymentKey})}).then(function(ro){
  return new Promise(function(resolve,reject){loadRzp(function(){
   var items=Object.keys(o.items).map(function(k){return k+' x '+o.items[k]}).join(', ');
   var r=new Razorpay({key:ro.keyId,order_id:ro.id,amount:ro.amount,currency:ro.currency,name:'Tinkerleaf',description:'Order '+o.id,prefill:{name:o.name,contact:o.phone,email:o.email||''},notes:{order_id:o.id,name:o.name,phone:o.phone,items:items.slice(0,250),address:(o.address+', '+o.city+' - '+o.pin).slice(0,250)},theme:{color:'#1f5c3f'},handler:function(res){resolve(res)},modal:{ondismiss:function(){reject(new Error('Payment cancelled. Your cart is safe.'))}}});
   r.on('payment.failed',function(x){reject(new Error('Payment failed'+(x&&x.error&&x.error.description?': '+x.error.description:'')))});r.open();
  },function(){reject(new Error('Could not load the payment window. Check your internet and try again.'))})});
 }).then(function(res){return apiJSON('/api/payments/razorpay/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({razorpay_order_id:res.razorpay_order_id,razorpay_payment_id:res.razorpay_payment_id,razorpay_signature:res.razorpay_signature,idempotencyKey:o.paymentKey})}).then(function(v){o.rzp=res.razorpay_payment_id;o.rzpOrderId=res.razorpay_order_id;o.rzpSignature=res.razorpay_signature;o.paid=true;finishOrder(o)})}).catch(function(e){reset();er.textContent='⚠️ '+e.message});}
function orderMsg(o){var ks=Object.keys(o.items);
 var pl=o.pm==='cod'?'Cash on Delivery':'Online payment (UPI) - PAID';
 return '🛒 New order '+o.id+'\n'+ks.map(function(k){return '- '+k+' x '+o.items[k]+' = ₹'+(o.items[k]*(PR[k]||0))}).join('\n')+'\nSubtotal: ₹'+o.sub+'\nDelivery: '+(o.ship?'₹'+o.ship:'FREE')+'\nTotal: ₹'+o.total+'\nPayment: '+pl
  +(o.pm==='online'?'\nAmount paid: ₹'+o.total+(o.rzp?'\nRazorpay Payment ID: '+o.rzp:'\nUPI Txn ID (UTR): '+o.utr+'\n(I will share the payment screenshot in this chat)'):'')
  +'\n\nName: '+o.name+'\nPhone: '+o.phone+'\nAddress: '+o.address+', '+o.city+' - '+o.pin+(o.email?'\nEmail: '+o.email:'')+(o.gstin?'\nGST invoice: '+o.biz+' ('+o.gstin+')':'')}
function finishOrder(o){
 var rec=!!CFG.ORDER_URL;o.pend=rec;
 sv('tl_guest',{name:o.name,phone:o.phone,address:o.address,city:o.city,pin:o.pin,email:o.email||'',biz:o.biz||'',gstin:o.gstin||''});
 var body=JSON.stringify({customer:{name:o.name,phone:o.phone,email:o.email||'',address:o.address,city:o.city,pin:o.pin,business:o.biz||'',gstin:o.gstin||''},paymentMethod:o.pm,paymentId:o.rzp||'',razorpayOrderId:o.rzpOrderId||'',razorpaySignature:o.rzpSignature||'',idempotencyKey:o.paymentKey||''});
 /* The server calculates items/prices/total itself. Same idempotency key => a retry can never create a 2nd order. */
 function attempt(n){
  return fetch('/api/orders',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:body}).then(function(r){
   return r.json().catch(function(){return {}}).then(function(x){if(!r.ok){var e=new Error(x.error||'Server could not save order');e.http=true;throw e}return x})
  }).catch(function(e){
   if(!e.http&&n<3){toast('⏳ Network problem, retrying…');return new Promise(function(res){setTimeout(res,1500*(n+1))}).then(function(){return attempt(n+1)})}
   throw e;
  });
 }
 attempt(0).then(function(saved){
   o.id=saved.orderId||o.id;o.serverOrderId=o.id;o.pend=false;
   var od=ld('tl_orders',[]);od.push(o);sv('tl_orders',od);
   o.wa='https://wa.me/'+WA+'?text='+encodeURIComponent(orderMsg(o));lastOrder=o;
   cart={};upd();loadServerStock();show('done');
   if(rec)notifyOrder(o);else window.open(o.wa,'_blank');
 }).catch(function(e){
   var b=$('plc');if(b){b.disabled=false;payBtnLabel()}
   toast('⚠️ Order was not saved: '+e.message);
   if(o.pm==='online'&&o.paid) toast('💳 Payment received but the order could not be saved. If it does not appear in My Orders, the amount is refunded automatically within about 30 minutes, or message us on WhatsApp.');
 });}
/* ---- order notification: Google Sheet (Apps Script) / Formspree ---- */
function orderPayload(o){var ks=Object.keys(o.items),pl={order_id:o.id,time:new Date(o.ts).toLocaleString('en-IN'),name:o.name,phone:o.phone,customer_email:o.email||'',gst_business:o.biz||'',gstin:o.gstin||'',address:o.address,city:o.city,pincode:o.pin,items:ks.map(function(k){return k+' x '+o.items[k]+' = ₹'+(o.items[k]*(PR[k]||0))}).join(' | '),subtotal:o.sub,delivery:o.ship,total:o.total,payment:o.pm==='cod'?'Cash on Delivery':(o.rzp?'Online (Razorpay)':'Online (UPI)'),utr:o.utr||'',rzp_payment_id:o.rzp||'',paid:o.paid?'YES':'NO',_subject:'New order '+o.id+' - ₹'+o.total};
 if(o.email)pl._replyto=o.email;return pl}
function postOrder(o){return fetch(CFG.ORDER_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(orderPayload(o)).toString()})}
function markSent(id){var od=ld('tl_orders',[]);od.forEach(function(x){if(x.id===id){x.pend=false;x.sent=true}});sv('tl_orders',od)}
function setOns(ok){var e=$('ons');if(!e)return;e.innerHTML=ok?'✅ <b>Your order is recorded with us.</b> We will confirm it on WhatsApp or by phone soon.':'⚠️ <b>We could not reach our server.</b> Please tap the WhatsApp button below so that we receive your order. We will also retry automatically.'}
function notifyOrder(o){postOrder(o).then(function(){markSent(o.id);setOns(true)}).catch(function(){setOns(false)})}
function retryPending(){if(!CFG.ORDER_URL)return;ld('tl_quotes',[]).filter(function(x){return x.pend}).forEach(function(x){postQuote(x).then(function(){markQ(x.id)}).catch(function(){})});ld('tl_orders',[]).filter(function(x){return x.pend}).forEach(function(x){postOrder(x).then(function(){markSent(x.id)}).catch(function(){})})}
window.addEventListener('online',retryPending);setTimeout(retryPending,3000);
function upiLink(o){return 'upi://pay?pa='+encodeURIComponent(UPI_ID)+'&pn='+encodeURIComponent(UPI_NAME)+'&am='+Number(o.total).toFixed(2)+'&cu=INR&tn='+encodeURIComponent('Tinkerleaf '+o.id)}
function payBtnLabel(){var b=$('plc'),r=document.querySelector('input[name="pm"]:checked');if(!b||!r)return;b.textContent=r.value==='online'?'📲 Continue to payment':'✅ Place order'}
function payHTML(){var o=lastOrder;if(!o)return '';
 var mob=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
 var h='<div class="cf payst"><div class="stp"><span class="dn"><em>✓</em>Details</span><hr><span class="cur"><em>2</em>Pay</span><hr><span><em>3</em>Done</span></div>';
 h+='<h4 style="margin-top:6px">📲 Scan &amp; pay</h4>';
 h+='<div class="qrcard"><div class="qrw" id="qrbox" aria-label="UPI QR code"></div><div class="qamt">'+rup(o.total)+'</div><small>Scan with GPay, PhonePe, Paytm or any UPI app.</small><small>The amount is already filled in.</small></div>';
 if(mob)h+='<a class="btn alt pay" href="'+upiLink(o)+'">📲 Open UPI app and pay '+rup(o.total)+'</a>';
 h+='<div class="upirow"><span>UPI ID: <b>'+esc(UPI_ID)+'</b></span><button type="button" data-a="copyupi">Copy</button></div>';
 h+='<h4>✅ After you pay</h4><div class="note" style="margin-top:0">Enter the 12-digit <b>UPI transaction ID (UTR)</b> from your payment app. After that we record your order and verify the payment.</div>';
 h+='<label class="l" for="utr">🔢 UPI transaction ID (UTR)</label><input id="utr" class="utr" inputmode="numeric" maxlength="12" autocomplete="off" placeholder="12-digit number">';
 h+='<div class="ce" id="pe" role="alert"></div><button class="btn pay" data-a="payok">✅ I have paid — place my order</button>';
 h+='<a href="#" data-a="paychg" class="lnk" style="display:block;text-align:center;margin-top:12px">‹ Change payment method</a>';
 h+='<div class="note">🔒 Your order is <b>not</b> placed until you confirm the payment here. We verify the payment and then confirm your order.</div></div>';
 return h}
function drawQR(){var o=lastOrder,box=$('qrbox');if(!o||!box)return;
 try{var qr=qrcode(0,'M');qr.addData(upiLink(o));qr.make();box.innerHTML=qr.createSvgTag({cellSize:4,margin:0,scalable:true})}
 catch(e){box.innerHTML='<img alt="UPI QR code" src="'+UPI_QR+'">'}}
function copyUPI(){var done=function(){toast('📋 UPI ID copied')};
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(UPI_ID).then(done,function(){toast('UPI ID: '+UPI_ID)})}
 else{var t=document.createElement('textarea');t.value=UPI_ID;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(e){toast('UPI ID: '+UPI_ID)}t.remove()}}
function confirmPay(){var o=lastOrder,er=$('pe'),u=($('utr').value||'').replace(/\s+/g,'');
 if(!o||o.pm!=='online'){show('cart');return}
 if(Object.keys(o.items).some(function(k){return !inStock(k)})){toast('😕 An item just went out of stock. Please check your cart.');show('cart');return}
 if(total()!==o.sub){toast('🛒 Your cart changed. Please check out again.');show('checkout');return}
 if(!/^\d{12}$/.test(u)){er.textContent='⚠️ Enter the 12-digit UPI transaction ID (UTR) shown in your payment app after paying.';$('utr').focus();return}
 var used=ld('tl_orders',[]).some(function(x){return x.utr===u});
 if(used){er.textContent='⚠️ This transaction ID was already used for another order.';return}
 o.utr=u;o.paid=true;finishOrder(o)}
function doneHTML(){var o=lastOrder;if(!o)return '';
 var on=o.pm==='online',rec=!!CFG.ORDER_URL;
 var h='<div class="ok"><div class="big">🎉</div><h3>Thank you, '+esc(o.name)+'!</h3><p>Your order <b>'+o.id+'</b> for <b>'+rup(o.total)+'</b> '+(rec?'is placed.':(on?'is placed and your payment details are ready to send.':'is ready to send.'))+'</p></div>';
 if(on)h+='<div class="note">✅ <b>'+(o.rzp?'Payment received':'Payment submitted')+'</b><br>'+(o.rzp?'Razorpay payment ID: <b>'+esc(o.rzp)+'</b>':'UPI transaction ID: <b>'+esc(o.utr)+'</b>')+'<br>Amount: <b>'+rup(o.total)+'</b></div>';
 h+=rec?'<div class="note" id="ons">⏳ Saving your order…</div>':'<div class="note">📲 A WhatsApp message with your order details has opened. <b>Please tap Send</b> so that we receive your order.'+(on?' You can also attach your payment screenshot in the same chat.':'')+'</div>';
 if(rec&&on&&!o.rzp)h+='<div class="note">📸 Optional: send your payment screenshot on WhatsApp to speed up verification.</div>';
 h+='<a class="btn" style="display:block;text-align:center;margin-top:12px" target="_blank" rel="noopener" href="'+o.wa+'">'+(rec?'💬 Chat with us on WhatsApp':'💬 Send order on WhatsApp')+'</a>';
 if(o.pm==='cod')h+='<div class="note" style="margin-top:12px">💵 <b>Cash on Delivery:</b> pay '+rup(o.total)+' in cash when your order arrives.</div>';
 else h+='<div class="note" style="margin-top:12px">We will verify your payment and confirm your order on WhatsApp.</div>';
 if(rec)h+='<a class="btn alt" data-a="x" style="display:block;text-align:center;margin-top:12px" href="#pg=track/'+encodeURIComponent(o.id)+'">🚚 Track this order</a>';
 h+='<button class="btn" data-a="x2" style="display:block;width:100%;border:0;cursor:pointer;font:inherit;font-weight:600;margin-top:12px">Continue shopping</button>';
 return h}
function showPage(k,arg){
 var P={
 terms:['Terms &amp; Conditions','Last updated: 3 October 2026',
 '<p>These Terms &amp; Conditions apply when you browse or buy from the Tinkerleaf website. By placing an order you agree to them. Tinkerleaf is based in Ahmedabad, Gujarat, India'+(CFG.GSTIN?' (GSTIN: '+CFG.GSTIN+')':'')+'.</p>'
 +'<h2>Orders</h2><ul><li>When you place an order, you are making an offer to buy. The order is confirmed when we confirm it to you on WhatsApp, phone or email, and for online payments after we receive your payment.</li><li>Please give a correct name, phone number and full delivery address. We are not responsible for delay or failed delivery caused by wrong details.</li><li>We may cancel an order if the item is out of stock, the price or product information on the website has an obvious mistake, or we cannot deliver to your pincode. If you have already paid, we refund the full amount as described in our <a href="#pg=policy">Return, Refund &amp; Delivery Policy</a>.</li></ul>'
 +'<h2>Prices and taxes</h2><ul><li>All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise.</li><li>Delivery charge: orders of '+rup(CFG.FREE_ABOVE)+' and above get free delivery. For smaller orders a flat charge of '+rup(CFG.SHIP)+' applies. The exact amount is shown in your cart and at checkout before you pay.</li><li>Prices and availability can change without notice. The price you see at checkout is the price you pay.</li></ul>'
 +'<h2>Invoice and GST</h2><ul><li>We provide a bill / invoice with every order.</li><li>If you need a GST invoice in the name of your business, school or institution, enter the business name and GSTIN in the optional "Need a GST invoice?" section at checkout, or tell us on WhatsApp <b>before</b> your order is dispatched. GST details cannot be added after dispatch.</li><li>Please check that your GSTIN and name are correct. We issue the invoice using the details you give us.</li></ul>'
 +'<h2>Payment</h2><ul><li>You can pay by Cash on Delivery (not available for every pincode) or online'+((CFG.RZP_KEY&&CFG.ORDER_URL)?' through Razorpay (UPI, cards and net banking)':' by UPI')+'.</li><li>We do not store your card or bank details.</li><li>Online orders are confirmed only after we verify that the payment has been received. If a payment is deducted but your order is not confirmed, contact us with the payment ID or transaction ID and we will fix it or refund you.</li></ul>'
 +'<h2>Stock</h2><p>Products marked "Out of stock" cannot be ordered. If an item becomes unavailable after you order, we will tell you and either wait for it, replace it or refund you, as you prefer.</p>'
 +'<h2>Delivery, returns and refunds</h2><p>Delivery times, returns, replacements, cancellation and refunds are explained in our <a href="#pg=policy">Return, Refund &amp; Delivery Policy</a>, which is part of these terms.</p>'
 +'<h2>Product information</h2><p>We try to keep descriptions, specifications and photos accurate. Photos are for reference, and colour or packaging may differ a little. Specifications come from the manufacturer or supplier. Please check that a product suits your project before you buy, and ask us if you are not sure.</p>'
 +'<h2>Safe use of electronic products</h2><ul><li>Our products are for learning, hobby and project use. Follow the instructions and the correct voltage and current ratings for each part.</li><li>Soldering irons, batteries, motors, drones, 3D printers and mains-powered items can cause burns, fire or injury if misused. Use them with care and with adult supervision for students under 18.</li><li>We are not responsible for damage caused by wrong wiring, wrong power supply, misuse or use outside the product specifications.</li></ul>'
 +'<h2>Project Guidance Card</h2><p>Orders of ₹1000 or more get a Project Guidance Card. It gives you 15 days of help with your project by WhatsApp or email, from wiring and code to choosing parts. It is guidance and support. We do not guarantee that your project will work or be completed. The card is not exchangeable for cash.</p>'
 +'<h2>Quotations and bulk orders</h2><p>A quotation is an estimate of price and availability for the products and quantity you asked for. It is valid for the period written on it. A bulk order is confirmed only when we confirm it in writing and receive the agreed payment.</p>'
 +'<h2>Use of this website</h2><p>The content, logo, text and images on this website belong to Tinkerleaf or their owners. Please do not copy or reuse them without permission. Please do not misuse the website or try to interfere with its working.</p>'
 +'<h2>Our liability</h2><p>To the extent the law allows, our liability for any order is limited to the amount you paid for that order. We are not liable for indirect losses, or for delays caused by couriers, weather or events outside our control. Nothing in these terms takes away your rights as a consumer under the Consumer Protection Act, 2019 or other applicable law.</p>'
 +'<h2>Governing law</h2><p>These terms are governed by the laws of India. Any dispute will be subject to the courts at Ahmedabad, Gujarat, subject to your rights as a consumer under applicable law.</p>'
 +'<h2>Changes</h2><p>We may update these terms from time to time. The date at the top shows the last update. The terms in force when you place your order apply to that order.</p>'
 +'<h2>Contact us</h2><p>Questions? Call 9122847563, message us on <a href="https://wa.me/919122847563" target="_blank" rel="noopener">WhatsApp</a> or email <a href="mailto:babliamisha@gmail.com">babliamisha@gmail.com</a>. See also our <a href="#pg=privacy">Privacy Policy</a>.</p>'],
 quote:['Get a Quotation','Buying for a school, college, startup or workshop? Tell us what you need and we will send you a quotation.',
 '<div class="ctf qf" id="qf"><label for="q1">👤 Your name *</label><input id="q1" autocomplete="name"><label for="q2">🏢 Organisation *</label><input id="q2" autocomplete="organization" placeholder="School, college, company, or write Individual"><label for="q3">📱 Phone number *</label><input id="q3" type="tel" autocomplete="tel"><label for="q4">📧 Email (optional)</label><input id="q4" type="email" autocomplete="email">'
 +'<h2 style="margin-top:20px">Products and quantity</h2><div id="qrows"></div><button type="button" class="btn alt" id="qadd" style="border:0;cursor:pointer;font:inherit;font-weight:600;margin-top:8px">＋ Add another product</button>'
 +'<label for="q5" style="margin-top:16px">📝 Anything else? (optional)</label><textarea id="q5" placeholder="Needed by when, delivery city, brand preference, GST invoice details…"></textarea>'
 +'<input id="q6" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;height:0;width:0;opacity:0">'
 +'<div class="ctl" id="qe" role="alert" style="color:#c0392b;min-height:1.2em;margin-top:8px"></div><div class="row"><button class="btn" id="qs">📨 Send quotation request</button></div></div><div id="qok" hidden></div>'],
 about:['About Us','Electronic components and real help with your projects.',
 '<div class="box"><p><b>Tinkerleaf</b> is a store for electronic components, STEM kits, drones, 3D printers and tools, based in Ahmedabad, Gujarat. We started Tinkerleaf for students, hobbyists and makers who want good parts and someone to ask when a project gets stuck.</p></div>'
 +'<h2>What we sell</h2><ul><li>Microcontroller boards, sensors, displays and modules</li><li>STEM and robotics kits for students and schools</li><li>Drones, 3D printers and 3D printing pens</li><li>Tools and instruments for your electronics workbench</li></ul>'
 +'<h2>Project Guidance Support</h2><p>When you buy materials worth ₹1000 or more, you get a Project Guidance Card. For 15 days you can ask us anything about your project on WhatsApp or email, from wiring and code to choosing the right parts.</p>'
 +'<h2>For schools and colleges</h2><p>We also help with bulk orders and lab setups. <a href="#b2b">See B2B and Lab Setup</a>.</p>'
 +'<h2>Get in touch</h2><p>Questions about a product or a project? <a href="#pg=contact">Contact us</a> or message us on <a href="https://wa.me/919122847563" target="_blank" rel="noopener">WhatsApp</a>.</p>'],
 policy:['Return, Refund &amp; Delivery Policy','Last updated: 2 October 2026',
 '<p>We want you to be happy with your order. This page explains how delivery, returns, refunds and cancellations work at Tinkerleaf.</p>'
 +'<h2>Delivery</h2><ul><li>We deliver all over India, to every state and union territory that our courier partners serve.</li><li>Orders are usually packed and dispatched within 1 to 3 business days after we confirm your order (and receive your payment for online orders).</li><li>Delivery usually takes 3 to 7 business days, depending on your location. Remote areas may take a little longer.</li><li><b>Delivery charges:</b> orders of '+rup(CFG.FREE_ABOVE)+' and above get <b>free delivery</b>. For orders below '+rup(CFG.FREE_ABOVE)+', a flat delivery charge of '+rup(CFG.SHIP)+' applies. The exact charge is always shown in your cart and at checkout before you pay.</li><li>When your order is dispatched, we share the courier and tracking details with you on WhatsApp.</li><li>Delays can happen because of the courier, weather or local holidays. We will keep you updated.</li></ul>'
 +'<h2>Payment</h2><ul><li><b>Cash on Delivery:</b> pay the order amount in cash to the delivery person. COD may not be available for every pincode. We will tell you if it is not.</li><li><b>Online payment:</b> pay with UPI. Your order is confirmed once we receive your payment.</li></ul>'
 +'<h2>Cancellation</h2><p>You can cancel your order before it is dispatched. Message us on WhatsApp with your order number. If you have already paid, we refund the full amount as described below.</p>'
 +'<h2>Returns</h2><p>You can request a return or replacement within 7 days of delivery if:</p><ul><li>the item is damaged or defective,</li><li>you received the wrong item, or</li><li>an item or part is missing from your order.</li></ul><p>Please keep the original packaging, and take an unboxing photo or video when you open the parcel. It helps us resolve your issue quickly.</p>'
 +'<h2>What we cannot return</h2><ul><li>Items that have been used, soldered, burnt or damaged after delivery</li><li>Items without their original packaging, parts or accessories</li><li>Items damaged by wrong wiring, wrong power supply or misuse</li></ul>'
 +'<h2>How to request a return</h2><ol><li>Message us on <a href="https://wa.me/919122847563" target="_blank" rel="noopener">WhatsApp</a> or email <a href="mailto:babliamisha@gmail.com">babliamisha@gmail.com</a> within 7 days of delivery.</li><li>Share your order number and clear photos or a video of the problem.</li><li>We check your request within 1 to 2 business days and tell you if we will replace the item or refund you.</li><li>For damaged, defective or wrong items, we cover the return shipping.</li></ol>'
 +'<h2>Refunds</h2><p>Once your return is received and checked, we send the refund within 5 to 7 business days. Online payments are refunded to the UPI account or bank account you paid from. For Cash on Delivery orders, we refund to the UPI ID or bank account you share with us.</p>'
 +'<h2>Project Guidance Card</h2><p>The Project Guidance Card is a free service with eligible orders. It is valid for 15 days from the date of your order.</p>'
 +'<h2>Contact us</h2><p>Questions? Call 9122847563, message us on WhatsApp or email <a href="mailto:babliamisha@gmail.com">babliamisha@gmail.com</a>. You can also visit our <a href="#pg=contact">Contact page</a>.</p>'],
 projects:['Projects &amp; Training','Readymade projects, help with your project idea, and training for beginners.',
 '<div class="box"><p>At Tinkerleaf we do more than sell parts. We help you build, learn and finish your project. Choose what you need below, and message us on WhatsApp. We will confirm the details and price with you.</p></div>'
 +'<h2>🎁 Readymade projects available</h2><p>Not enough time to start from zero? Ask us for a readymade project. It is a good choice for school and college submissions, science fairs and exhibitions.</p><p><b>Popular project types</b></p><ul><li>Obstacle avoiding and line follower robots</li><li>IoT projects with ESP32 and NodeMCU, like home automation and weather monitors</li><li>Arduino projects with sensors, displays and motors</li><li>Drone and 3D pen based mini projects</li></ul><p>Tell us your class, subject and budget. We will tell you what is available, what is included and the price.</p><p><a class="btn" target="_blank" rel="noopener" href="https://wa.me/919122847563?text=Hi%20Tinkerleaf%2C%20I%20want%20to%20know%20about%20readymade%20projects.">💬 Ask about readymade projects</a></p>'
 +'<h2>💡 Project idea implementation help</h2><p>Already have a project idea? We help you turn it into a working project, step by step.</p><ol><li><b>Share your idea</b> on WhatsApp. A short message or a rough sketch is enough.</li><li><b>We plan it with you:</b> we suggest the parts, the board and a simple circuit plan.</li><li><b>You build it</b> with our guidance on wiring, code and testing.</li><li><b>We help you fix problems</b> until it works.</li></ol><p>If you buy materials worth ₹1000 or more from us, you also get the free Project Guidance Card with 15 days of support.</p><p><a class="btn" target="_blank" rel="noopener" href="https://wa.me/919122847563?text=Hi%20Tinkerleaf%2C%20I%20have%20a%20project%20idea%20and%20need%20help%20to%20build%20it.">💬 Share my project idea</a></p>'
 +'<h2>🎓 Training: Basic Electronics and Microcontroller Boards</h2><p>Learn by doing. Our training is made for beginners, school students and college students who want a strong start.</p><div class="ctg"><div class="ctc"><span>🔌</span><b>Basic Electronics</b><small>Voltage, current and resistance. Common components like resistors, capacitors, LEDs and transistors. Breadboard, multimeter and basic soldering.</small></div><div class="ctc"><span>🧠</span><b>Microcontroller Boards</b><small>Arduino, ESP32 and Raspberry Pi Pico basics. Coding, sensors, displays and motors, and an introduction to IoT.</small></div></div><p>You build small projects as you learn, so you finish with something that works. Ask us about the next batch, duration, mode and fees.</p><p><a class="btn" target="_blank" rel="noopener" href="https://wa.me/919122847563?text=Hi%20Tinkerleaf%2C%20I%20want%20to%20know%20about%20the%20training%20%28Basic%20Electronics%20/%20Microcontroller%20Boards%29.">💬 Ask about training</a></p>'
 +'<h2>Need parts for your project?</h2><p>Browse <a href="#stem">STEM kits</a>, <a href="#components">electronic components</a>, <a href="#displays">displays</a> and <a href="#tools">tools</a> on our home page. You can also read about the <a href="#guidance">Project Guidance Support</a>.</p>'],
 post1:['5 Beginner Arduino Projects You Can Finish in a Weekend','Small projects, big skills. Each one takes an hour or two.','<p>New to Arduino? These five projects teach you the basics step by step. All of them use an Arduino UNO, a breadboard and jumper wires. Do one in the evening and you can finish all five in a weekend.</p><h2>1. LED Blink</h2><p>The "hello world" of electronics. Make an LED turn on and off every second. <b>You learn:</b> digital output and delays. <b>Parts:</b> LED, 220 ohm resistor.</p><h2>2. Button with LED</h2><p>Press a push button to light an LED. <b>You learn:</b> digital input and if-else logic. <b>Parts:</b> push button, LED, resistor.</p><h2>3. Potentiometer (brightness control)</h2><p>Turn a knob to make an LED brighter or dimmer. <b>You learn:</b> analog input and PWM output. <b>Parts:</b> 10k potentiometer, LED, resistor.</p><h2>4. Ultrasonic Distance Meter</h2><p>Measure how far an object is and show it on the Serial Monitor. <b>You learn:</b> sensors and timing. <b>Parts:</b> HC-SR04 ultrasonic sensor.</p><h2>5. Traffic Light</h2><p>Make red, yellow and green LEDs change in order, like a real traffic signal. <b>You learn:</b> sequencing and planning your code. <b>Parts:</b> 3 LEDs, 3 resistors.</p><h2>Get the parts</h2><p>You will find the <a href="#components">UNO board, breadboard, jumper wires, LEDs, resistors and sensors</a> on our home page. Or choose a ready <a href="#stem">starter kit</a>. Stuck on a project? Ask us on <a href="https://wa.me/919122847563" target="_blank" rel="noopener">WhatsApp</a>.</p>'],
 post2:['How to Choose Between ESP32 and Arduino UNO','Right board, right project.','<p>Both boards are great, but they are good at different things. Here is a simple way to choose.</p><h2>Choose ESP32 if you want</h2><ul><li><b>Wi-Fi and Bluetooth</b> built in</li><li>A more powerful processor and more memory</li><li>To build <b>IoT and wireless projects</b>, like home automation or a web server</li></ul><h2>Choose Arduino UNO if you want</h2><ul><li>A simple board that is <b>easy to learn</b></li><li>A <b>large community</b> with many tutorials and examples</li><li>A stable and reliable board that is <b>more affordable</b></li><li>A great start for <b>beginners and basic projects</b></li></ul><h2>One thing to remember</h2><p>The UNO works with 5 V signals, while the ESP32 works with 3.3 V. Check this before connecting sensors and modules, so you do not damage a board. You can program both with the Arduino IDE.</p><h2>Our suggestion</h2><p>If you are just starting, begin with the UNO and learn the basics. When you want your project to connect to the internet, move to the ESP32.</p><p>See our <a href="#components">boards and modules</a> or the <a href="#stem">ESP32 IoT Learning Kit</a>. Need help choosing? <a href="#pg=contact">Contact us</a>.</p>'],
 post3:['Soldering for Beginners: Tools and Common Mistakes','Small skills, big projects.','<p>Soldering joins components to a circuit board. It is easy to learn with some practice, and it makes your projects strong and lasting.</p><h2>Essential tools</h2><ul><li><b>Soldering iron</b> with a stand</li><li><b>Solder wire</b> (rosin core)</li><li><b>Soldering sponge</b> to clean the tip</li><li><b>Flux</b> (optional, but helpful)</li><li><b>Wire cutters</b> to trim leads</li><li><b>Tweezers</b> for small components</li></ul><h2>Simple steps</h2><ol><li>Heat the pad and the component lead together for 2 to 3 seconds.</li><li>Touch the solder to the pad and lead, not to the iron tip.</li><li>Remove the solder first, then the iron.</li><li>Let the joint cool. A good joint is shiny and shaped like a small cone.</li></ol><h2>Common mistakes</h2><ul><li><b>Not heating enough</b> gives cold, weak joints.</li><li><b>Too much solder</b> makes messy joints.</li><li><b>A dirty tip</b> passes heat poorly. Wipe it on the sponge.</li><li><b>Holding the iron too long</b> can damage components.</li><li><b>Wrong polarity</b> on LEDs and diodes. Check before you solder.</li><li><b>Shaky hands</b> lead to weak joints. Use a stand or helping hands.</li></ul><h2>Stay safe</h2><p>Work in a place with fresh air, never touch the hot tip, and always put the iron back in its stand.</p><p>Find <a href="#tools">soldering tools</a> like solder wire, flux, a desoldering pump and a helping hands stand on our home page.</p>'],
 contact:['Contact Us','We are happy to help. Reach us any time.',
 '<div class="ctg"><a class="ctc" target="_blank" rel="noopener" href="https://wa.me/919122847563"><span>💬</span><b>WhatsApp</b><small>9122847563</small></a><a class="ctc" href="tel:+919122847563"><span>📞</span><b>Call us</b><small>9122847563</small></a><a class="ctc" href="mailto:babliamisha@gmail.com"><span>✉️</span><b>Email</b><small>babliamisha@gmail.com</small></a><a class="ctc" target="_blank" rel="noopener" href="https://www.google.com/maps/search/Ahmedabad,+Gujarat"><span>📍</span><b>Location</b><small>Ahmedabad, Gujarat</small></a></div>'
 +'<h2>Send us a message</h2><div class="ctf"><label for="k1">👤 Your name</label><input id="k1" autocomplete="name"><label for="k2">📧 Your email or phone</label><input id="k2"><label for="k3">💬 Message</label><textarea id="k3"></textarea><div class="ctl" id="ke" style="color:#c0392b;min-height:1.2em;margin-top:8px"></div><div class="row"><button class="btn" id="kw">💬 Send on WhatsApp</button><button class="btn alt" id="km">✉️ Send by email</button></div></div>'],
 privacy:['Privacy Policy','Last updated: 2 October 2026',
 '<p>This Privacy Policy explains how Tinkerleaf ("we", "us") handles your information when you use this website. We are based in Ahmedabad, Gujarat, India.</p>'
 +'<h2>Information we collect</h2><ul><li><b>Saved checkout details:</b> you need a Tinkerleaf account to place an order. To save you typing, the name, phone, address and email from your last order are remembered in your own browser on your device. You can remove them by clearing your browser data.</li><li><b>Cart and wishlist:</b> the items you save are stored in your own browser.</li><li><b>Order details:</b> when you place an order, we receive your name, phone number, email (if you give it), delivery address, GST details (if you give them) and the items you ordered. We keep these in our order records so that we can pack, deliver and support your order. We may also receive them on WhatsApp.</li><li><b>Quotation requests:</b> if you send a quotation request, we receive your name, organisation, phone, email and the products and quantities you list.</li><li><b>Messages and newsletter:</b> if you contact us or subscribe to our newsletter, we receive the details you send through WhatsApp or email.</li></ul>'
 +'<h2>How we use it</h2><ul><li>To process and deliver your orders</li><li>To give you project guidance and support</li><li>To reply to your questions</li><li>To send you updates, only if you subscribed</li></ul>'
 +'<h2>Payments</h2><p>We do not store your card or bank details. '+((CFG.RZP_KEY&&CFG.ORDER_URL)?'Online payments are processed securely by Razorpay (UPI, cards and net banking). Razorpay has its own privacy policy.':'Online payments are made with UPI in your own UPI app.')+' For Cash on Delivery, you pay when your order arrives.</p>'
 +'<h2>Third-party services</h2><p>This website uses an online order-recording service (such as Google Sheets or Formspree) to receive your orders, and WhatsApp for messages and support, and Google Fonts to show text styles. These services have their own privacy policies.</p>'
 +'<h2>Cookies and advertising</h2><p>This website uses your browser storage to remember your cart, wishlist and saved checkout details. If we show ads on this website, third-party vendors including Google may use cookies to serve ads based on your earlier visits to this and other websites. You can opt out of personalised advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google Ads Settings</a>.</p>'
 +'<h2>Sharing your information</h2><p>We do not sell your personal information. We share your delivery details only with the courier or delivery partner that delivers your order, and when the law requires it.</p>'
 +'<h2>How long we keep it</h2><p>We keep order and support details for as long as needed to serve you and meet our legal and accounting duties. Details saved in your browser stay there until you clear your browser data.</p>'
 +'<h2>Your choices</h2><p>You can ask us to correct or delete the personal details you have shared with us by contacting us. You can also clear your browser data at any time to remove your saved cart, wishlist and checkout details from your device.</p>'
 +'<h2>Children</h2><p>This website is not meant for children under 13 to share personal details. Young students should ask a parent or teacher to place orders.</p>'
 +'<h2>Changes to this policy</h2><p>We may update this policy from time to time. The date at the top shows when it was last changed.</p>'
 +'<h2>Contact us</h2><p>Questions about this policy? Email <a href="mailto:babliamisha@gmail.com">babliamisha@gmail.com</a> or call 9122847563.</p>']};
 P.orders=['My orders','Everything you have ordered from Tinkerleaf, newest first.','<div id="ordFilter" class="ofilter" role="group" aria-label="Filter orders"></div><div id="ordList" aria-live="polite"></div>'];
 P.track=['Track your order','Enter your order ID to see where your order is. You can find it in your confirmation email and in My orders.','<form id="trkForm" class="trkform" novalidate><label for="trkId">Order ID</label><div class="trkrow"><input id="trkId" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="TL12345678" value="'+esc(arg||'')+'"><button class="btn" type="submit">Track order</button></div><div class="ce" id="trkErr" role="alert"></div></form><div id="trkRecent"></div><div id="trkOut" aria-live="polite"></div>'];
 var x=P[k],pd=$('pdp');
 var pi=k.indexOf('post')===0?document.querySelectorAll('.post .pimg img')[+k.slice(4)-1]:null;pd.innerHTML='<div class="pgw"><a class="back" href="#top">‹ Back to home</a><h1>'+x[0]+'</h1><p class="lead">'+x[1]+'</p>'+(pi?'<img class="pbn" alt="'+esc(x[0])+'" src="'+pi.src+'">':'')+x[2]+'</div>';
 if(k==='contact'){
  var rd=function(){var n=$('k1').value.trim(),c=$('k2').value.trim(),m=$('k3').value.trim();if(!n||!m){$('ke').textContent='⚠️ Please enter your name and message.';return null}$('ke').textContent='';return {n:n,c:c,m:m}};
  $('kw').onclick=function(){var r=rd();if(!r)return;window.open('https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Tinkerleaf, I am '+r.n+(r.c?' ('+r.c+')':'')+'.\n'+r.m),'_blank')};
  $('km').onclick=function(){var r=rd();if(!r)return;location.href='mailto:babliamisha@gmail.com?subject='+encodeURIComponent('Message from '+r.n)+'&body='+encodeURIComponent(r.m+'\n\n'+r.n+(r.c?'\n'+r.c:''))};}
 if(k==='quote')initQuote();
 if(k==='orders')initOrders();if(k==='track')initTrack(arg);
 $('top').style.display='none';pd.hidden=false;document.title=x[0]+' – Tinkerleaf';}
/* ---- order history + order tracking pages ---- */
var ORDER_STEPS=['placed','confirmed','packed','shipped','delivered'];
var ORDER_HINT={placed:'We have received your order and will confirm it soon.',confirmed:'Your order is confirmed and will be packed next.',packed:'Your items are packed and waiting for the courier.',shipped:'Your order is on its way. Delivery usually takes 3 to 7 business days.',delivered:'Your order was delivered. Enjoy building!'};
function odate(d){return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
function otime(d){return new Date(d).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'})}
function ostat(s){return '<span class="ostat" data-s="'+esc(s)+'">'+esc(orderStatusLabel(s))+'</span>'}
function opay(o){if(o.paymentStatus==='refunded')return 'Refunded';if(o.paymentMethod==='online')return o.paymentStatus==='paid'?'Paid online':'Online payment pending';return 'Cash on delivery'}
function ordersSignIn(el,msg){el.innerHTML='<div class="ostate"><h2>'+esc(msg)+'</h2><p>Your orders are saved to your Tinkerleaf account.</p><button class="btn" type="button" id="osi">Sign in</button></div>';$('osi').onclick=function(){accountModal('signin')}}
function orderFail(el,e){var m=(e&&e.message)||'';if(/authentication|session|user not found/i.test(m)){ordersSignIn(el,'Sign in to continue');return}el.innerHTML='<div class="ostate"><h2>Could not load your orders</h2><p>'+esc(m||'Please check your connection and try again.')+'</p></div>'}
function initOrders(){var el=$('ordList'),fl=$('ordFilter');if(!el)return;
 if(!account){fl.hidden=true;ordersSignIn(el,'Sign in to see your orders');return}
 el.innerHTML='<div class="empty">Loading your orders…</div>';
 apiJSON('/api/orders/my').then(function(list){
  if(!list.length){fl.hidden=true;el.innerHTML='<div class="ostate"><h2>No orders yet</h2><p>Orders you place will show up here with their status.</p><a class="btn" href="#products">Browse products</a></div>';return}
  var F=[['all','All'],['active','In progress'],['delivered','Delivered'],['cancelled','Cancelled']],cur='all';
  function match(o,k){return k==='all'||(k==='active'?(o.status!=='delivered'&&o.status!=='cancelled'):o.status===k)}
  function draw(){
   fl.innerHTML=F.map(function(f){var n=list.filter(function(o){return match(o,f[0])}).length;return '<button type="button" data-f="'+f[0]+'" aria-pressed="'+(cur===f[0])+'">'+f[1]+' <small>'+n+'</small></button>'}).join('');
   var shown=list.filter(function(o){return match(o,cur)});
   el.innerHTML=shown.length?shown.map(function(o){
    var open=o.status!=='delivered'&&o.status!=='cancelled';
    return '<article class="ocard"><div class="ohead"><div><b class="oid">'+esc(o.orderId)+'</b><span>Placed on '+odate(o.createdAt)+'</span></div>'+ostat(o.status)+'</div>'
     +'<ul class="oitems">'+o.items.map(function(i){return '<li><span>'+esc(i.name)+' <small>× '+i.quantity+'</small></span><span>'+rup(i.price*i.quantity)+'</span></li>'}).join('')+'</ul>'
     +'<div class="ofoot"><div><span>Total</span><b>'+rup(o.total)+'</b><small>'+esc(opay(o))+(o.delivery?' · incl. '+rup(o.delivery)+' delivery':' · free delivery')+'</small></div><div class="row" style="gap:6px;justify-content:flex-end"><a class="btn'+(open?' alt':'')+'" href="#pg=track/'+encodeURIComponent(o.orderId)+'">'+(open?'Track order':'View details')+'</a>'+((o.status==='placed'||o.status==='confirmed'||o.status==='packed')?'<button class="btn alt" type="button" data-cancel-order="'+esc(o.orderId)+'">Cancel</button>':'')+(o.status==='delivered'&&!o.returnRequest?.requested?'<button class="btn alt" type="button" data-return-order="'+esc(o.orderId)+'">Return request</button>':'')+'</div></div></article>';
   }).join(''):'<div class="empty">No '+F.filter(function(f){return f[0]===cur})[0][1].toLowerCase()+' orders.</div>';}
  fl.hidden=false;fl.onclick=function(e){var b=e.target.closest('[data-f]');if(!b)return;cur=b.dataset.f;draw()};draw();
 }).catch(function(e){fl.hidden=true;orderFail(el,e)});}
function initTrack(id){var form=$('trkForm'),out=$('trkOut'),inp=$('trkId');if(!form)return;
 form.onsubmit=function(e){e.preventDefault();var v=inp.value.trim().toUpperCase().replace(/\s+/g,'');if(!v){$('trkErr').textContent='Enter your order ID, for example TL12345678.';inp.focus();return}$('trkErr').textContent='';if(v===id)loadTrack(v);else location.hash='#pg=track/'+encodeURIComponent(v)};
 if(account)apiJSON('/api/orders/my').then(function(list){var r=$('trkRecent');if(!r||!list.length)return;r.innerHTML='<div class="trkrecent"><span>Your recent orders</span>'+list.slice(0,5).map(function(o){return '<a class="ochip" href="#pg=track/'+encodeURIComponent(o.orderId)+'"'+(o.orderId===id?' aria-current="true"':'')+'>'+esc(o.orderId)+' <small>'+esc(orderStatusLabel(o.status))+'</small></a>'}).join('')+'</div>'}).catch(function(){});
 if(id)loadTrack(id);
 function loadTrack(oid){
  if(!account){ordersSignIn(out,'Sign in to track your order');return}
  out.innerHTML='<div class="empty">Looking up '+esc(oid)+'…</div>';
  apiJSON('/api/orders/'+encodeURIComponent(oid)).then(function(o){out.innerHTML=trackHTML(o)}).catch(function(e){
   if(/not found/i.test(e.message||'')){out.innerHTML='<div class="ostate"><h2>We could not find order '+esc(oid)+'</h2><p>Check the order ID, and make sure you are signed in to the account that placed the order.</p></div>';return}
   orderFail(out,e)});}}
function trackHTML(o){
 var hist=o.statusHistory||[],cancelled=o.status==='cancelled',idx=ORDER_STEPS.indexOf(o.status),c=o.customer||{};
 function ev(st){var e=hist.filter(function(x){return x.status===st}).slice(-1)[0];return e||(st==='placed'?{at:o.createdAt}:null)}
 var steps=ORDER_STEPS.map(function(st,j){var e=ev(st),state;
  if(cancelled)state=e?'done':'todo';else if(o.status==='delivered'||j<idx)state='done';else if(j===idx)state='now';else state='todo';
  var when=e?otime(e.at):(cancelled?'Not reached':'Pending');
  return '<li class="ostep" data-state="'+state+'"'+(state==='now'?' aria-current="step"':'')+'><span class="odot" aria-hidden="true">'+(state==='done'?'✓':'')+'</span><div><b>'+orderStatusLabel(st)+'</b><small><span class="osr">'+(state==='done'?'Completed. ':state==='now'?'Current step. ':'Not reached yet. ')+'</span>'+when+'</small>'+(state==='now'&&ORDER_HINT[st]?'<p>'+ORDER_HINT[st]+'</p>':'')+'</div></li>'}).join('');
 if(cancelled){var ce=ev('cancelled');steps+='<li class="ostep" data-state="cancel"><span class="odot" aria-hidden="true">✕</span><div><b>Cancelled</b><small>'+(ce?otime(ce.at):'')+'</small><p>This order was cancelled. If you paid online, the refund follows our <a href="#pg=policy">refund policy</a>.</p></div></li>'}
 var ship='';
 if(o.status==='shipped'||o.status==='delivered'){
  if(o.courier||o.trackingNumber)ship='<div class="oship"><div><span>Courier</span><b>'+esc(o.courier||'Not shared yet')+'</b></div><div><span>Tracking number</span><b>'+esc(o.trackingNumber||'Not shared yet')+'</b></div></div>';
  else if(o.status==='shipped')ship='<div class="note">We will share the courier and tracking number with you on WhatsApp.</div>'}
 var wa='https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Tinkerleaf, I need help with order '+o.orderId);
 return '<section class="tcard"><div class="thead"><div><h2>Order '+esc(o.orderId)+'</h2><span>Placed on '+odate(o.createdAt)+'</span></div>'+ostat(o.status)+'</div>'
  +ship
  +'<ol class="otl">'+steps+'</ol></section>'
  +'<section class="tcard"><h3>Order details</h3><ul class="oitems">'+o.items.map(function(i){return '<li><span>'+esc(i.name)+' <small>× '+i.quantity+'</small></span><span>'+rup(i.price*i.quantity)+'</span></li>'}).join('')+'</ul>'
  +'<dl class="osum"><div><dt>Subtotal</dt><dd>'+rup(o.subtotal)+'</dd></div><div><dt>Delivery</dt><dd>'+(o.delivery?rup(o.delivery):'Free')+'</dd></div><div class="tot"><dt>Total</dt><dd>'+rup(o.total)+'</dd></div><div><dt>Payment</dt><dd>'+esc(opay(o))+'</dd></div></dl></section>'
  +'<section class="tcard"><h3>Delivering to</h3><address class="oaddr"><b>'+esc(c.name||'')+'</b><br>'+esc(c.address||'')+'<br>'+esc(c.city||'')+' - '+esc(c.pin||'')+(c.phone?'<br>'+esc(c.phone):'')+'</address></section>'
  +'<div class="tact"><a class="btn" href="#pg=orders">All my orders</a><a class="btn alt" target="_blank" rel="noopener" href="'+wa+'">Need help? WhatsApp us</a><a class="btn alt" target="_blank" rel="noopener" href="/api/orders/'+encodeURIComponent(o.orderId)+'/invoice">🧾 Download invoice PDF</a></div>'}
/* ---- quotation form ---- */
function initQuote(){var rows=$('qrows'),n=0;
 if(!$('qlist')){var dl=document.createElement('datalist');dl.id='qlist';dl.innerHTML=Object.keys(PR).map(function(k){return '<option value="'+esc(k)+'">'}).join('');document.body.appendChild(dl)}
 function add(pv,qv){if(n>=10){toast('Maximum 10 products. Add the rest in the notes box.');return}n++;var d=document.createElement('div');d.className='qrow';
  d.innerHTML='<input class="qp" list="qlist" placeholder="Product name" aria-label="Product" value="'+esc(pv||'')+'"><input class="qq" type="number" min="1" max="100000" inputmode="numeric" placeholder="Qty" aria-label="Quantity" value="'+esc(qv||'')+'"><button type="button" class="qx" aria-label="Remove">✕</button>';
  d.querySelector('.qx').onclick=function(){if(rows.children.length>1){d.remove();n--}else{d.querySelector('.qp').value='';d.querySelector('.qq').value=''}};rows.appendChild(d)}
 add();$('qadd').onclick=function(){add()};
 $('qs').onclick=function(){var g=function(i){return $(i).value.trim()},er=$('qe'),nm=g('q1'),og=g('q2'),ph=g('q3'),em=g('q4'),nt=g('q5');
  var it=[];rows.querySelectorAll('.qrow').forEach(function(r){var a=r.querySelector('.qp').value.trim(),b=parseInt(r.querySelector('.qq').value,10);if(a||b)it.push({p:a,q:b})});
  if(!nm){er.textContent='⚠️ Enter your name.';return}if(!og){er.textContent='⚠️ Enter your organisation (or write Individual).';return}
  if(!/^[0-9+\s-]{10,15}$/.test(ph)){er.textContent='⚠️ Enter a valid phone number.';return}
  if(em&&!/^\S+@\S+\.\S+$/.test(em)){er.textContent='⚠️ Enter a valid email or leave it blank.';return}
  if(!it.length){er.textContent='⚠️ Add at least one product with quantity.';return}
  for(var i=0;i<it.length;i++){if(!it[i].p||!(it[i].q>=1)){er.textContent='⚠️ Each row needs a product name and a quantity of 1 or more.';return}}
  er.textContent='';
  if($('q6').value)return; /* honeypot: bots fill this */
  var q={id:'Q'+String(Date.now()).slice(-8),ts:Date.now(),name:nm,org:og,phone:ph,email:em,items:it,notes:nt};
  var msg='📋 Quotation request '+q.id+'\nName: '+nm+'\nOrganisation: '+og+'\nPhone: '+ph+(em?'\nEmail: '+em:'')+'\n\nProducts:\n'+it.map(function(x){return '- '+x.p+' x '+x.q}).join('\n')+(nt?'\n\nNotes: '+nt:'');
  q.wa='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
  var done=function(rec){$('qf').hidden=true;var o=$('qok');o.hidden=false;
   o.innerHTML='<div class="ok"><div class="big">'+(rec?'✅':'📲')+'</div><h3>'+(rec?'Request received':'One more step')+'</h3><p>'+(rec?'Thank you, '+esc(nm)+'. We will contact you on <b>'+esc(ph)+'</b> with your quotation.':'Tap the button below and press <b>Send</b> in WhatsApp so that we receive your request.')+'</p></div><a class="btn" style="display:block;text-align:center;margin-top:12px" target="_blank" rel="noopener" href="'+q.wa+'">💬 '+(rec?'Chat with us on WhatsApp':'Send on WhatsApp')+'</a><a class="btn alt" style="display:block;text-align:center;margin-top:10px" href="#top">Back to home</a>';
   window.scrollTo(0,0)};
  if(!CFG.ORDER_URL){window.open(q.wa,'_blank');done(false);return}
  var b=$('qs');b.disabled=true;b.textContent='⏳ Sending…';
  var ql=ld('tl_quotes',[]);q.pend=true;ql.push(q);sv('tl_quotes',ql);
  postQuote(q).then(function(){markQ(q.id);done(true)}).catch(function(){b.disabled=false;b.textContent='📨 Send quotation request';done(false)})}}
function quotePayload(q){return{type:'quote',quote_id:q.id,time:new Date(q.ts).toLocaleString('en-IN'),name:q.name,organisation:q.org,phone:q.phone,customer_email:q.email||'',items:q.items.map(function(x){return x.p+' x '+x.q}).join(' | '),notes:q.notes||'',_subject:'Quotation request '+q.id+' - '+q.org,_replyto:q.email||''}}
function postQuote(q){return fetch(CFG.ORDER_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(quotePayload(q)).toString()})}
function markQ(id){var ql=ld('tl_quotes',[]);ql.forEach(function(x){if(x.id===id){x.pend=false}});sv('tl_quotes',ql)}
$('md').addEventListener('click',function(e){if(e.target===$('md'))closeAll()});
Object.keys(cart).forEach(function(k){if(PR[k]===undefined)delete cart[k]});
var _gone=Object.keys(cart).filter(function(k){return !inStock(k)});_gone.forEach(function(k){delete cart[k]});
if(_gone.length)setTimeout(function(){upd();toast('⚠️ '+_gone.length+' item(s) in your cart are now out of stock and were removed')},800);wish=wish.filter(function(n){return PR[n]!==undefined});

route();
resetPasswordFromUrl();
upd();
$('db').addEventListener('change',function(e){if(e.target&&e.target.name==='pm')payBtnLabel()});

/* =====================================================================
   Tinkerleaf shop v5: catalog + smart search + filters + sort
   ===================================================================== */
(function(){
 var PAGE=12;
 var CATS=[['best','⭐ Bestsellers'],['all','All products'],['new','🆕 New launches'],['components','Components'],['boards','Boards & Modules'],['tools','Tools'],['displays','Displays'],['drones','Drones'],['3d','3D printing'],['stem','STEM kits']];
 /* Category -> sub-category tree. A sub-category with no products is hidden automatically; it appears as soon as a matching product exists. */
 var TAX=[
  ['components','Components',[['resistors','Resistors'],['capacitors','Capacitors'],['leds','LEDs'],['sensors','Sensors'],['ics','ICs'],['wires','Wires & jumpers']]],
  ['boards','Boards & Modules',[['arduino','Arduino'],['esp32','ESP32 & ESP8266'],['raspberry','Raspberry Pi'],['relay','Relay modules'],['motor','Motors & drivers']]],
  ['tools','Tools',[['soldering','Soldering'],['multimeter','Multimeter'],['wire','Wire tools'],['screwdriver','Screwdrivers & pliers'],['measure','Measuring & power']]],
  ['displays','Displays',[['oled','OLED'],['lcd','LCD'],['tft','TFT'],['leddisp','LED displays']]],
  ['drones','Drones',[['dronekits','Drone kits'],['flight','Flight controllers']]],
  ['3d','3D printing',[['printers','3D printers'],['pens','3D pens']]],
  ['stem','STEM kits',[['robotics','Robotics'],['electronics','Electronics & IoT'],['science','Science & invention']]]];
 /* First matching rule wins. To move a product, change or add a line here. [category, sub-category, name pattern] */
 var RULES=[['drones','flight',/pixhawk|flight controller/i],['drones','dronekits',/drone/i],['3d','pens',/printing pen/i],['3d','printers',/bambu|3d printer/i],
  ['components','resistors',/resistor/i],['components','capacitors',/capacitor/i],['displays','oled',/oled/i],['displays','lcd',/lcd/i],['displays','tft',/tft/i],['displays','leddisp',/segment|dot matrix/i],
  ['components','leds',/\bled\b/i],['stem','robotics',/robot|2wd|obstacle/i],['stem','science',/makey|science kit|simple circuits/i],['stem','electronics',/kit|learning|acebott/i],
  ['tools','multimeter',/multimeter/i],['tools','soldering',/solder|flux|witty fox/i],['tools','wire',/wire strip/i],['tools','screwdriver',/screwdriver|pliers/i],['tools','measure',/vernier|power supply/i],
  ['boards','relay',/relay/i],['boards','motor',/l298n|servo|motor/i],['boards','raspberry',/raspberry|pico/i],['boards','esp32',/esp32|esp8266|nodemcu|xiao/i],['boards','arduino',/arduino|nano/i],
  ['components','sensors',/sensor|hc-sr04|dht/i],['components','wires',/jumper|wire/i]];
 function taxOf(n){for(var i=0;i<RULES.length;i++)if(RULES[i][2].test(n))return[RULES[i][0],RULES[i][1]];return['components','']}
 function taxCat(id){for(var i=0;i<TAX.length;i++)if(TAX[i][0]===id)return TAX[i];return null}
 function subLabel(c,sid){var t=taxCat(c);if(t)for(var i=0;i<t[2].length;i++)if(t[2][i][0]===sid)return t[2][i][1];return ''}
 function inCat(e,c){return c.split(',').some(function(x){return e.tags.indexOf(x)>-1})}
 var TITLES={best:'Shop our bestsellers',all:'Shop all products',new:'New launches',drones:'Drones',  '3d':'3D printers &amp; pens',stem:'STEM kits',tools:'Tools &amp; instruments',components:'Electronic components',boards:'Boards &amp; modules','components,boards':'Components &amp; boards',displays:'Displays'};
 var SUBS={best:'Our most-loved picks. Tap a product to see details or add it to your cart.',all:'Every product in the Tinkerleaf store, in one place.'};
 var KW={boards:'board boards module modules microcontroller',drones:'drone quadcopter fpv flight',  '3d':'3d printer printing',stem:'stem kit kits learning student school college robot robotics science',tools:'tool tools instrument',components:'component components electronic electronics',displays:'display screen',new:'new launch'};
 var SECS=[['products','best'],['g-new','new'],['g-stem','stem'],['g-tools','tools'],['g-components','components'],['g-displays','displays']];

 var POP={};
 var BRANDS=[['Arduino',/arduino/i],['Raspberry Pi',/raspberry/i],['Bambu Lab',/bambu/i],['Holybro',/holybro|pixhawk/i],['Goofoo',/goofoo/i],['Pluto',/pluto/i],['Snapmaker',/snapmaker/i],['M5Stack',/m5stack/i],['ACEBOTT',/acebott/i],['Seeed Studio',/seeed|xiao/i],['Witty Fox',/witty fox/i],['Makey Makey',/makey/i]];
 function brandOf(n){for(var i=0;i<BRANDS.length;i++)if(BRANDS[i][1].test(n))return BRANDS[i][0];return 'Other'}
 /* ---------- catalog ---------- */
 var CAT=[],seen={};
 SECS.forEach(function(s){(D[s[0]]||[]).forEach(function(p,i){
  var n=p[0];if(!n)return;var e=seen[n];
  if(!e){e=seen[n]={n:n,p:p[1],o:p[2],tags:[],ord:CAT.length,bi:9999};CAT.push(e)}
  if(e.tags.indexOf(s[1])<0)e.tags.push(s[1]);
  if(s[1]==='best')e.bi=i;
 })});
 function tag(e,t){if(e.tags.indexOf(t)<0)e.tags.push(t)}
 CAT.forEach(function(e){var n=e.n;
  e.tags=e.tags.filter(function(t){return t==='best'||t==='new'});
  var tx=taxOf(n);e.cat=tx[0];e.sub=tx[1];tag(e,e.cat);
  e.off=e.o>e.p?Math.round((e.o-e.p)/e.o*100):0;
  var kw=e.tags.map(function(t){return KW[t]||''}).join(' ');
  e.brand=brandOf(n);e.hay=norm(n+' '+kw+' '+(e.brand==='Other'?'':e.brand)+' '+taxCat(e.cat)[1].replace(/&/g,' ')+' '+subLabel(e.cat,e.sub).replace(/&/g,' '));e.w=e.hay.split(' ');e.flat=e.hay.replace(/ /g,'');
  e.nw=norm(n).split(' ');
 });
 function norm(s){return String(s).toLowerCase().replace(/wi-?fi/g,'wifi').replace(/&/g,' and ').replace(/[^a-z0-9.]+/g,' ').replace(/\.(?![0-9])/g,' ').replace(/\s+/g,' ').trim()}
 var ALIAS={rpi:'raspberry',raspi:'raspberry',nodemcu:'nodemcu',esp:'esp32',cam:'camera',printer:'printer',lcd:'lcd',bluetooth:'bluetooth'};

 /* ---------- search ---------- */
 function near(a,b){if(a===b)return true;var la=a.length,lb=b.length;if(Math.abs(la-lb)>1)return false;var i=0;while(i<la&&i<lb&&a[i]===b[i])i++;
  if(la===lb){if(a.slice(i+1)===b.slice(i+1))return true;return i+1<la&&a[i]===b[i+1]&&a[i+1]===b[i]&&a.slice(i+2)===b.slice(i+2)}
  return la>lb?a.slice(i+1)===b.slice(i):b.slice(i+1)===a.slice(i)}
 function tokScore(e,t,fz){var best=0,w=e.w,k;
  for(k=0;k<w.length;k++){if(w[k]===t){best=5;break}if(t.length>2&&w[k].indexOf(t)===0&&best<4)best=4}
  if(!best&&t.length>2&&e.flat.indexOf(t)>-1)best=3;
  if(!best&&fz){for(k=0;k<w.length;k++){var x=w[k];if(x.length>=4&&(near(x,t)||(x.length>t.length&&near(x.slice(0,t.length),t)))){best=1.5;break}}}
  return best}
 function search(q){
  var toks=norm(q).split(' ').filter(Boolean).map(function(t){return ALIAS[t]||t});
  if(!toks.length)return{list:[],relaxed:false};
  var strict=[],loose=[];
  /* typo-tolerance only for words (5+ letters) that match nothing exactly anywhere */
  var fz=toks.map(function(t){return t.length>=5&&!CAT.some(function(e){return tokScore(e,t,false)>0})});
  CAT.forEach(function(e){var sum=0,hit=0,all=true;
   toks.forEach(function(t,i){var sc=tokScore(e,t,fz[i]);if(sc){sum+=sc;hit++}else all=false});
   if(!hit)return;
   if(e.nw.indexOf(toks[0])===0||e.hay.indexOf(toks.join(' '))===0)sum+=2;
   if(e.hay.indexOf(toks.join(' '))>-1)sum+=3;
   if(e.bi<9999)sum+=.3;
   (all?strict:loose).push({e:e,s:sum})});
  var by=function(a,b){return b.s-a.s||a.e.ord-b.e.ord};
  if(strict.length)return{list:strict.sort(by).map(function(x){return x.e}),relaxed:false,toks:toks};
  return{list:loose.sort(by).map(function(x){return x.e}),relaxed:true,toks:toks}}
 function hl(name,toks){var out=esc(name);
  (toks||[]).slice().sort(function(a,b){return b.length-a.length}).forEach(function(t){if(t.length<2)return;
   try{out=out.replace(new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')(?![^<]*>)','ig'),'<mark>$1</mark>')}catch(x){}});
  return out}

 /* ---------- state + helpers ---------- */
 var S={cat:'best',sub:'',sort:'default',q:'',shown:PAGE,brand:'',min:'',max:'',stock:false,fcat:''};
 var grid=$('grid'),chipsEl=$('shopChips'),statusEl=$('searchStatus'),sortEl=$('sortProducts'),moreEl=$('shopMore'),moreBtn=$('shopMoreBtn'),
     subChips=$('shopSubChips'),q=$('q'),form=$('srch'),sug=$('sug'),clearBtn=$('clearSearch'),titleEl=$('shopTitle'),subEl=$('shopSub');
 if(!grid||!q)return;
 grid.innerHTML='';
 function count(c){return c==='all'?CAT.length:CAT.filter(function(e){return inCat(e,c)}).length}
 function catLabel(c){for(var i=0;i<CATS.length;i++)if(CATS[i][0]===c)return CATS[i][1];return c}
 /* Newest: new launches first, then by date added in the database. Popular: units sold (non-cancelled orders), then bestseller order. */
 function newRank(e){return (e.tags.indexOf('new')>-1?1e15:0)+(serverMeta[e.n]||0)}
 function popScore(e){return (POP[e.n]||0)*1000+(e.bi<9999?100-e.bi:0)+(wish.indexOf(e.n)>-1?1:0)}
 function passes(e){
  if(S.brand&&e.brand!==S.brand)return false;
  if(!S.q&&S.sub&&e.sub!==S.sub)return false;
  if(S.min!==''&&e.p<+S.min)return false;
  if(S.max!==''&&e.p>+S.max)return false;
  if(S.stock&&!inStock(e.n))return false;
  if(S.q&&S.fcat&&e.tags.indexOf(S.fcat)<0)return false;
  return true}
 function filtersOn(){return !!(S.brand||S.min!==''||S.max!==''||S.stock||(S.q&&S.fcat))}
 function sortList(a,mode){a=a.slice();
  if(mode==='low')a.sort(function(x,y){return x.p-y.p});
  else if(mode==='high')a.sort(function(x,y){return y.p-x.p});
  else if(mode==='disc')a.sort(function(x,y){return y.off-x.off||x.ord-y.ord});
  else if(mode==='new')a.sort(function(x,y){return newRank(y)-newRank(x)||x.ord-y.ord});
  else if(mode==='pop')a.sort(function(x,y){return popScore(y)-popScore(x)||x.ord-y.ord});
  else if(mode==='az')a.sort(function(x,y){return x.n.localeCompare(y.n)});
  return a}
 function current(){
  if(S.q){var r=search(S.q);return{list:sortList(r.list.filter(passes),S.sort==='default'?'':S.sort),relaxed:r.relaxed,toks:r.toks,search:true}}
  var a=(S.cat==='all'?CAT.slice():CAT.filter(function(e){return inCat(e,S.cat)})).filter(passes);
  if(S.cat==='best')a.sort(function(x,y){return x.bi-y.bi});
  return{list:S.sort==='default'?a:sortList(a,S.sort),search:false}}

 /* ---------- product card ---------- */
 function buildCard(e){var n=e.n,d=document.createElement('div');d.className='prod';
  var img=PIMG[n]?'<img alt="" loading="lazy" src="'+PIMG[n]+'">':ico(n,'');
  d.innerHTML=(e.off>0?'<span class="sale">Sale '+e.off+'%</span>':'')
   +'<div class="ph">'+img+'<button class="heart" aria-label="Add to wishlist"></button></div><h3></h3>'
   +'<div class="price">'+f(e.p)+'<s>'+f(e.o)+'</s></div>'+(e.off>0?'<div class="sv">Save ₹'+(e.o-e.p).toLocaleString('en-IN')+'</div>':'')
   +'<div class="act"><button class="add">🛒 Add to cart</button><a class="ow" target="_blank" rel="noopener" href="https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Tinkerleaf, I have a question about: '+n)+'">💬 WhatsApp</a></div>';
  var h3=d.querySelector('h3');h3.textContent=n;
  var heart=d.querySelector('.heart');heart.dataset.n=n;heart.onclick=function(ev){ev.stopPropagation();togW(n)};
  heart.textContent=wish.indexOf(n)>-1?'❤️':'🤍';
  d.querySelector('.add').onclick=function(){addC(n)};
  var go=function(){location.hash='#p='+encodeURIComponent(n);window.scrollTo(0,0)};
  var ph=d.querySelector('.ph');ph.style.cursor='pointer';h3.style.cursor='pointer';
  ph.addEventListener('click',function(ev){if(ev.target.closest('.heart'))return;go()});h3.addEventListener('click',go);
  return d}

 /* ---------- render ---------- */
 function render(){
  var cur=current(),list=cur.list,total=list.length;
  /* chips */
  chipsEl.innerHTML=CATS.map(function(c){var on=!S.q&&S.cat===c[0];
   return '<button type="button" class="chip'+(on?' on':'')+'" data-c="'+c[0]+'" aria-pressed="'+on+'">'+c[1]+' <i>'+count(c[0])+'</i></button>'}).join('');
  /* heading */
  if(S.q){titleEl.innerHTML='Search results';subEl.textContent='Showing products that match what you typed.'}
  else{titleEl.innerHTML=TITLES[S.cat]||'Shop';subEl.textContent=SUBS[S.cat]||('Browse '+catLabel(S.cat).replace(/^[^A-Za-z0-9]+/,'')+' from Tinkerleaf.');
   if(S.sub){var tc0=taxCat(S.cat);titleEl.textContent=subLabel(S.cat,S.sub);subEl.textContent=(tc0?tc0[1]:'')+' › '+subLabel(S.cat,S.sub)}}
  /* sub-category chips (only for one main category, only sub-categories that have products) */
  var tc=!S.q&&taxCat(S.cat);
  if(tc){var subs=tc[2].map(function(x){return[x[0],x[1],CAT.filter(function(e){return e.cat===S.cat&&e.sub===x[0]}).length]}).filter(function(x){return x[2]>0}),nAll=count(S.cat);
   subChips.innerHTML='<span class="subl">'+esc(tc[1])+':</span><button type="button" class="chip sm'+(S.sub?'':' on')+'" data-sub="">All <i>'+nAll+'</i></button>'+subs.map(function(x){return '<button type="button" class="chip sm'+(S.sub===x[0]?' on':'')+'" data-sub="'+x[0]+'" aria-pressed="'+(S.sub===x[0])+'">'+esc(x[1])+' <i>'+x[2]+'</i></button>'}).join('');subChips.hidden=false}
  else{subChips.hidden=true;subChips.innerHTML=''}
  sortEl.options[0].text=S.q?'Best match':'Featured';
  /* grid */
  grid.innerHTML='';
  if(!total){
   var nm=document.createElement('div');nm.className='nores';
   nm.innerHTML='<div class="big">🔍</div><h3>No products found for “'+esc(S.q)+'”</h3><p>Check the spelling or try a shorter word. If you are looking for something specific, ask us. We can arrange it for you.</p>'
    +'<div class="row"><a class="btn" target="_blank" rel="noopener" href="https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Tinkerleaf, do you have: '+S.q+'?')+'">💬 Ask us on WhatsApp</a><button type="button" class="btn alt" data-x="clear">View all products</button></div>'
    +'<div class="tryl">Popular searches: '+['Arduino','ESP32','OLED','Drone','Sensor','Soldering'].map(function(w){return '<button type="button" data-try="'+w+'">'+w+'</button>'}).join('')+'</div>';
   if(filtersOn()){nm.innerHTML='<div class="big">🔍</div><h3>No products match these filters</h3><p>Try a wider price range, another brand, or turn off “In stock only”.</p><div class="row"><button type="button" class="btn" data-x="freset">Reset filters</button></div>'}
   grid.appendChild(nm);
  }else{list.slice(0,S.shown).forEach(function(e){grid.appendChild(buildCard(e))})}
  /* status line */
  var shown=Math.min(S.shown,total);
  if(S.q){statusEl.innerHTML=(total?(cur.relaxed?'<span class="rel">No exact match.</span> Showing <b>'+total+'</b> related product'+(total===1?'':'s'):'<b>'+total+'</b> result'+(total===1?'':'s'))+' for “'+esc(S.q)+'”':'No results for “'+esc(S.q)+'”')+' <button type="button" class="clr" data-x="clear">✕ Clear search</button>'}
  else statusEl.innerHTML='Showing <b>'+shown+'</b> of <b>'+total+'</b> product'+(total===1?'':'s');
  if(filtersOn())statusEl.innerHTML+=' <button type="button" class="clr" data-x="freset">✕ Reset filters</button>';
  updFilterUI();
  /* show more */
  var left=total-shown;moreEl.hidden=left<=0;if(left>0)moreBtn.textContent='Show '+Math.min(PAGE,left)+' more products ('+left+' left)';
 }

 function setCat(c,opts){S.cat=c;S.sub=(opts&&opts.sub)||'';S.q='';q.value='';form.classList.remove('has');S.shown=PAGE;render();closeSug();if(opts&&opts.scroll)goShop()}
 function doSearch(v){v=(v||'').trim();S.q=v;S.sub='';S.shown=PAGE;if(!v){S.cat='best'}render();closeSug();form.classList.toggle('has',!!q.value);goShop()}
 function clearSearch(focus){q.value='';S.q='';S.fcat='';if(fCat)fCat.value='';S.shown=PAGE;form.classList.remove('has');render();closeSug();if(focus)q.focus()}
 function goShop(){
  if(location.hash.indexOf('#p=')===0||location.hash.indexOf('#pg=')===0){location.hash='#products';return}
  var el=$('products');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
  if(location.hash!=='#products'){try{history.replaceState(null,'','#products')}catch(e){}}}

 chipsEl.addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;setCat(b.dataset.c)});
 subChips.addEventListener('click',function(e){var b=e.target.closest('[data-sub]');if(!b)return;S.sub=b.dataset.sub;S.shown=PAGE;render()});
 sortEl.addEventListener('change',function(){S.sort=sortEl.value;S.shown=PAGE;render();
  toast({default:S.q?'Best match first':'Featured order',low:'Sorted: lowest price first',high:'Sorted: highest price first',disc:'Sorted: biggest discount first',az:'Sorted: A to Z',new:'Sorted: newest first',pop:'Sorted: most popular first'}[S.sort])});
 moreBtn.addEventListener('click',function(){S.shown+=PAGE;render()});
 $('products').addEventListener('click',function(e){
  if(e.target.closest('[data-x="freset"]')){resetFilters();return}
  var c=e.target.closest('[data-x="clear"]');if(c){clearSearch(false);return}
  var t=e.target.closest('[data-try]');if(t){q.value=t.dataset.try;form.classList.add('has');doSearch(t.dataset.try)}});

 /* ---------- search box: suggestions ---------- */
 var hi=-1;
 function closeSug(){sug.hidden=true;sug.innerHTML='';hi=-1;q.setAttribute('aria-expanded','false')}
 function items(){return Array.prototype.slice.call(sug.querySelectorAll('.sg,.sgall'))}
 function setHi(i){var a=items();a.forEach(function(x){x.classList.remove('hl')});hi=i;if(a[i]){a[i].classList.add('hl');a[i].scrollIntoView({block:'nearest'})}}
 function openSug(){
  var v=q.value.trim();if(!v){closeSug();return}
  var r=search(v),top=r.list.slice(0,6),h='';
  if(top.length){
   h+='<div class="sgh">'+(r.relaxed?'Related products':'Products')+'</div>';
   top.forEach(function(e){var im=PIMG[e.n]?'<img alt="" src="'+PIMG[e.n]+'">':ico(e.n,'');
    h+='<a class="sg" role="option" href="#p='+encodeURIComponent(e.n)+'"><span class="st">'+im+'</span><span class="sn">'+hl(e.n,r.toks)+'<small>'+catLabel(e.tags.filter(function(t){return t!=='best'&&t!=='new'})[0]||e.tags[0]).replace(/^[^A-Za-z0-9]+/,'')+'</small></span><span class="sp">'+f(e.p)+'</span></a>'});
   h+='<button type="button" class="sgall" data-sa="1">See all '+r.list.length+' result'+(r.list.length===1?'':'s')+' for “'+esc(v)+'” ›</button>';
  }else{
   h+='<div class="sgno">No product found for <b>“'+esc(v)+'”</b>.<br>Check the spelling, or ask us and we will help you find it.<br><a class="sgwa" target="_blank" rel="noopener" href="https://wa.me/'+WA+'?text='+encodeURIComponent('Hi Tinkerleaf, do you have: '+v+'?')+'">💬 Ask on WhatsApp</a></div>'}
  sug.innerHTML=h;sug.hidden=false;hi=-1;q.setAttribute('aria-expanded','true')}
 var tmr;
 q.addEventListener('input',function(){form.classList.toggle('has',!!q.value);clearTimeout(tmr);tmr=setTimeout(openSug,90)});
 q.addEventListener('focus',function(){if(q.value.trim())openSug()});
 q.addEventListener('keydown',function(e){
  if(e.key==='Escape'){closeSug();return}
  if(sug.hidden)return;var a=items();if(!a.length)return;
  if(e.key==='ArrowDown'){e.preventDefault();setHi((hi+1)%a.length)}
  else if(e.key==='ArrowUp'){e.preventDefault();setHi((hi-1+a.length)%a.length)}
  else if(e.key==='Enter'&&hi>-1){e.preventDefault();a[hi].click()}});
 sug.addEventListener('click',function(e){
  var all=e.target.closest('[data-sa]');if(all){doSearch(q.value);return}
  if(e.target.closest('a.sg')){closeSug()}});
 sug.addEventListener('mousedown',function(e){e.preventDefault()});
 document.addEventListener('click',function(e){if(!form.contains(e.target))closeSug()});
 form.addEventListener('submit',function(e){e.preventDefault();doSearch(q.value)});
 clearBtn.addEventListener('click',function(){clearSearch(true);toast('Search cleared')});
 window.addEventListener('hashchange',function(){if(location.hash.indexOf('#p=')===0)closeSug()});

 /* Brand tiles / old callers: they set q.value and dispatch "submit" - handled above. */
 window.TLshop={search:doSearch,setCat:setCat,clear:clearSearch,refresh:function(){render()},
  info:function(n){var e=seen[n];if(!e)return null;var t=taxCat(e.cat);return{cat:e.cat,catLabel:t?t[1]:'',sub:e.sub,subLabel:subLabel(e.cat,e.sub),brand:e.brand}}};
 apiJSON('/api/products/popularity').then(function(d){POP=d||{};render()}).catch(function(){});

 /* ---------- filters: category (while searching), brand, price range, in-stock ---------- */

 var fBox=$('shopFilters'),fCat=$('fCat'),fBrand=$('fBrand'),fMin=$('fMin'),fMax=$('fMax'),fStock=$('fStock'),fTog=$('fltToggle'),fCount=$('fltCount'),ftm;
 function updFilterUI(){if(!fBox)return;fBox.classList.toggle('hascat',!!S.q);
  var n=(S.brand?1:0)+(S.min!==''||S.max!==''?1:0)+(S.stock?1:0)+(S.q&&S.fcat?1:0);fCount.textContent=n;fCount.hidden=!n}
 function resetFilters(){S.brand='';S.min='';S.max='';S.stock=false;S.fcat='';S.shown=PAGE;
  if(fBox){fBrand.value='';fCat.value='';fMin.value='';fMax.value='';fStock.checked=false}render()}
 if(fBox){
  var bc={};CAT.forEach(function(e){bc[e.brand]=(bc[e.brand]||0)+1});
  fBrand.innerHTML='<option value="">All brands</option>'+Object.keys(bc).sort(function(a,b){return a==='Other'?1:b==='Other'?-1:a.localeCompare(b)}).map(function(b){return '<option value="'+esc(b)+'">'+esc(b)+' ('+bc[b]+')</option>'}).join('');
  fCat.innerHTML='<option value="">All categories</option>'+CATS.filter(function(c){return c[0]!=='best'&&c[0]!=='all'}).map(function(c){return '<option value="'+c[0]+'">'+c[1].replace(/^[^A-Za-z0-9]+/,'')+'</option>'}).join('');
  function apply(){S.brand=fBrand.value;S.fcat=fCat.value;S.stock=fStock.checked;S.min=fMin.value.trim();S.max=fMax.value.trim();S.shown=PAGE;render()}
  fBrand.addEventListener('change',apply);fCat.addEventListener('change',apply);fStock.addEventListener('change',apply);
  [fMin,fMax].forEach(function(i){i.addEventListener('input',function(){clearTimeout(ftm);ftm=setTimeout(apply,250)})});
  $('fReset').addEventListener('click',function(){resetFilters();toast('Filters cleared')});
  fTog.addEventListener('click',function(){var o=fBox.classList.toggle('open');fTog.setAttribute('aria-expanded',o)});
 }

 /* ---------- same idea for every carousel section: count + sort + "View all" ---------- */
 SECS.slice(1).forEach(function(s){
  var g=$(s[0]);if(!g)return;
  var cards=Array.prototype.slice.call(g.querySelectorAll('.prod'));
  cards.forEach(function(c,i){c.dataset.ord=i});
  var bar=document.createElement('div');bar.className='sectool';
  bar.innerHTML='<span class="scn"></span><span class="sctl"><label>Sort <select aria-label="Sort products">'
   +'<option value="default">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="disc">Biggest discount</option></select></label>'
   +(s[1]==='new'?'':'<button type="button" class="sva">View all ›</button>')+'</span>';
  var anchor=g.closest('.stb')||g;anchor.parentNode.insertBefore(bar,anchor);
  function upd2(){var n=Array.prototype.filter.call(g.querySelectorAll('.prod'),function(c){return c.style.display!=='none'}).length;bar.querySelector('.scn').innerHTML='<b>'+n+'</b> product'+(n===1?'':'s')}
  function key(c,m){var nme=c.querySelector('h3').textContent,pr=PR[nme]||0,op=OP[nme]||pr;
   return m==='low'?pr:m==='high'?-pr:m==='disc'?-(op>pr?(op-pr)/op:0):+c.dataset.ord}
  bar.querySelector('select').addEventListener('change',function(){var m=this.value;
   Array.prototype.slice.call(g.querySelectorAll('.prod')).sort(function(a,b){return key(a,m)-key(b,m)||(+a.dataset.ord)-(+b.dataset.ord)}).forEach(function(c){g.appendChild(c)});
   g.scrollTo({left:0});toast(m==='default'?'Featured order':m==='low'?'Lowest price first':m==='high'?'Highest price first':'Biggest discount first')});
  var va=bar.querySelector('.sva');if(va)va.addEventListener('click',function(){setCat(s[1]==='components'?'components,boards':s[1],{scroll:true})});
  var tabs=g.closest('section').querySelector('.tabs');if(tabs)tabs.addEventListener('click',function(){setTimeout(upd2,0)});
  upd2()});

 render();
 var cm0=location.hash.match(/^#cat=([\w,]+)(?:\/([\w-]+))?$/);if(cm0)setCat(cm0[1],{scroll:true,sub:cm0[2]||''});
 else if(/^#p=/.test(location.hash))route();
})();

/* footer GSTIN */
(function(){if(!CFG.GSTIN)return;var f=document.querySelector('.fbot span');if(f)f.innerHTML+=' &nbsp;·&nbsp; GSTIN: '+esc(CFG.GSTIN)})();

/* ---- Install as an app (PWA) + notifications ---- */
var tlPrompt=null,tlLoadedAt=Date.now();
function tlStandalone(){try{return (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true}catch(e){return false}}
function tlIsIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function tlCanNotify(){return 'Notification' in window}
/* extra items for the side menu */
function appMenuHTML(){var h='';
 if(!tlStandalone())h+='<button class="mi" data-app="install">📲 Install Tinkerleaf App</button>';
 if(tlCanNotify()&&Notification.permission!=='granted')h+='<button class="mi" data-app="notify">🔔 Turn on notifications</button>';
 return h}
function tlHideBanner(){var b=$('appBanner');if(b)b.remove()}
function tlShowBanner(title,text,label,action){tlHideBanner();var b=document.createElement('div');b.className='app-banner';b.id='appBanner';b.setAttribute('role','dialog');b.setAttribute('aria-label',title);
 b.innerHTML='<span class="ab-ic" aria-hidden="true">'+(action==='notify'?'🔔':'📲')+'</span><div class="ab-tx"><b>'+esc(title)+'</b><span>'+esc(text)+'</span></div><div class="ab-bt">'+(label?'<button type="button" data-app="'+action+'">'+esc(label)+'</button>':'')+'<button type="button" data-app="close">'+(label?'Not now':'Got it')+'</button></div>';
 document.body.appendChild(b)}
/* shown when the browser cannot open its own install dialog (iPhone Safari, or Chrome has not offered it yet) */
function tlHelp(){var t;
 if(tlIsIOS())t='Tap the Share button (⬆️) in Safari, then choose “Add to Home Screen”.';
 else if(/android/i.test(navigator.userAgent))t='Open the browser menu (⋮) and tap “Install app” or “Add to Home screen”.';
 else t='Click the install icon at the right end of the address bar, or open the browser menu and choose “Install Tinkerleaf”.';
 tlShowBanner('Install the Tinkerleaf app',t,'','')}
function tlInstall(){
 if(tlStandalone()){toast('✅ You are already using the app');return}
 if(tlPrompt){var p=tlPrompt;tlPrompt=null;p.prompt();if(p.userChoice)p.userChoice.then(function(c){if(c&&c.outcome==='accepted')toast('📲 Installing Tinkerleaf…')}).catch(function(){});return}
 tlHelp()}
/* system notification (works from the installed app and from a normal tab) */
function tlNotify(title,body,url){if(!tlCanNotify()||Notification.permission!=='granted')return;
 var o={body:body,icon:'/icon-192.png',badge:'/icon-192.png',tag:'tl-'+title,data:{url:url||'/'}};
 var plain=function(){try{new Notification(title,o)}catch(e){}};
 if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration){navigator.serviceWorker.getRegistration().then(function(r){if(r&&r.showNotification)r.showNotification(title,o);else plain()}).catch(plain)}else plain()}
function tlEnableNotifications(){
 if(!tlCanNotify()){toast('Notifications are not supported on this browser');return}
 if(Notification.permission==='denied'){toast('Notifications are blocked. Allow them in your browser settings.');return}
 Notification.requestPermission().then(function(p){if(p==='granted'){toast('🔔 Notifications are on');tlNotify('🍃 Notifications are on','You will see Tinkerleaf updates here.')}else toast('Notifications were not turned on')})}
function tlAutoPrompt(){
 if($('appBanner'))return;
 if(tlStandalone()){ /* inside the installed app: offer notifications once */
  if(tlCanNotify()&&Notification.permission==='default'&&!ld('tl_notify_asked',0)){sv('tl_notify_asked',1);tlShowBanner('Get order updates','Turn on notifications to hear about your order and new offers.','Turn on','notify')}
  return}
 if(Date.now()-ld('tl_app_dismiss',0)<7*864e5)return;
 if(tlPrompt||tlIsIOS())tlShowBanner('Install the Tinkerleaf app','Shop faster, track your orders and open Tinkerleaf from your home screen.',tlPrompt?'Install':'How to install','install');
 /* people who allowed notifications also get a (weekly at most) reminder as a system notification */
 if(tlCanNotify()&&Notification.permission==='granted'&&(tlPrompt||tlIsIOS())&&Date.now()-ld('tl_app_reminder',0)>7*864e5){sv('tl_app_reminder',Date.now());tlNotify('📲 Install the Tinkerleaf app','Add Tinkerleaf to your home screen for faster shopping.')}}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();tlPrompt=e;setTimeout(tlAutoPrompt,Math.max(500,tlLoadedAt+8000-Date.now()))});
window.addEventListener('appinstalled',function(){tlPrompt=null;tlHideBanner();sv('tl_app_dismiss',Date.now());toast('🎉 Tinkerleaf app installed');tlNotify('🎉 Tinkerleaf app installed','Open it from your home screen anytime.')});
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('[data-app]'):null;if(!t)return;var a=t.getAttribute('data-app');
 if(a==='install'){e.preventDefault();tlHideBanner();tlInstall();closeAll()}
 else if(a==='notify'){e.preventDefault();tlHideBanner();tlEnableNotifications();closeAll()}
 else if(a==='close'){e.preventDefault();tlHideBanner();sv('tl_app_dismiss',Date.now())}},true);
if(tlStandalone())[].forEach.call(document.querySelectorAll('[data-app="install"]'),function(a){a.hidden=true});
if('serviceWorker' in navigator&&(location.protocol==='https:'||/^(localhost|127\.0\.0\.1)$/.test(location.hostname)))window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})});
setTimeout(tlAutoPrompt,8000);
