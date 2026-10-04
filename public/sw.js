/* Tinkerleaf service worker: lets the website be installed as an app and open even on a weak connection.
   - Pages / scripts / styles: network first, saved copy used only when offline (so updates always arrive).
   - Product images: saved after first view (fast repeat visits).
   - /api/*, admin and payment pages are NEVER cached. */
const VERSION = 'tl-v8';
const SHELL = 'shell-' + VERSION, IMGS = 'img-' + VERSION;
const SHELL_FILES = ['/', '/style.css', '/script.js', '/stock.js', '/qrcode.js', '/site.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => Promise.all(SHELL_FILES.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== IMGS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                                    // Razorpay, fonts etc. go straight to the network
  if (url.pathname.startsWith('/api/') || url.pathname === '/admin.html' || url.pathname === '/sw.js') return;

  if (url.pathname.startsWith('/images/')) {                                          // images: cache first
    e.respondWith(caches.open(IMGS).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }))));
    return;
  }
  const isPage = req.mode === 'navigate';
  e.respondWith(fetch(req).then(r => {                                                // everything else: network first
    if (r.ok && !isPage) { const copy = r.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }
    if (r.ok && isPage && url.pathname === '/') { const copy = r.clone(); caches.open(SHELL).then(c => c.put('/', copy)); }
    return r;
  }).catch(() => caches.match(req).then(hit => hit || (isPage ? caches.match('/') : Response.error()))));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.focus(); if ('navigate' in c) c.navigate(target); return; } }
    return self.clients.openWindow(target);
  }));
});
