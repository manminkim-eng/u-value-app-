/* ═══════════════════════════════════════════════════
   열관류율 종합 검토 시스템  MANMIN Ver-5.0
   Service Worker — 오프라인 캐시 + 버전 업데이트  ·  ARCHITECT KIM MANMIN

   v5.0.0 (2026-09-03)
   [변경] 문서(HTML)까지 Cache-first 로 처리하던 v3.2 구조를 고쳤다(§11-2).
   ⛔ navigate 분기를 제거하지 말 것. 분기 순서는 navigate → 정적 자산(§18-14).
   [변경] 캐시 삭제 범위를 자기 접두어(PREFIX)로 한정(§17-1) · 종전 'manmin-uval-v3.2' 는 ORPHAN(§18-7).
   [변경] React·Babel·Pretendard CDN 프리캐시 유지 · dom-to-image 제거 · html2canvas 추가.
═══════════════════════════════════════════════════ */
const PREFIX = 'uval-';
const CACHE  = 'uval-v5.0.0';
const ORPHAN = ['manmin-uval-v3.2','manmin-uval-v3.1','manmin-uval-v3.0'];
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png',
  './assets/fonts/manmin-fonts.css',
  './assets/fonts/NotoSansKR-var.woff2',
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@400;600;700&display=swap',
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.29.7/babel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

self.addEventListener('install', e => {
  console.log('[SW] Install:', CACHE);
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(ASSETS.map(u => c.add(u).catch(err => console.warn('[SW] precache skip:', u, err)))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  console.log('[SW] Activate:', CACHE);
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE && (k.indexOf(PREFIX) === 0 || ORPHAN.indexOf(k) !== -1))
            .map(k => { console.log('[SW] 구버전 캐시 삭제:', k); return caches.delete(k); })
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return;

  /* ⛔ HTML 문서는 Network-first */
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(res => { if (res && res.status === 200) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); } return res; })
        .catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  /* 정적 자산 · CDN : Cache-First + 백그라운드 갱신 */
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        fetch(e.request).then(res => { if (res && res.status === 200) caches.open(CACHE).then(c => c.put(e.request, res.clone())); }).catch(() => {});
        return cached;
      }
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data && e.data.type === 'GET_VERSION' && e.ports[0]) e.ports[0].postMessage({ version: CACHE });
});
console.log('[SW] loaded:', CACHE);
