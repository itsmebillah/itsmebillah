/* ============================================
   PORTFOLIO SYSTEM - SERVICE WORKER
   ============================================
   Version: 4.0.0 | PWA Enabled
   ============================================ */

const CACHE_NAME = 'portfolio-v4.0.0';
const API_CACHE_NAME = 'portfolio-api-v4.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1585241936939-be4099591252?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80'
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/projects',
    '/api/certificates',
    '/api/articles',
    '/api/skills',
    '/api/settings'
];

// ==================== INSTALL EVENT ====================
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching app shell...');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('✅ App shell cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Failed to cache app shell:', error);
            })
    );
});

// ==================== ACTIVATE EVENT ====================
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        // Clean up old caches
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// ==================== FETCH EVENT ====================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Handle API requests with network-first strategy
    if (isApiRequest(url)) {
        event.respondWith(handleApiRequest(request));
        return;
    }
    
    // Handle image requests with cache-first strategy
    if (isImageRequest(request)) {
        event.respondWith(handleImageRequest(request));
        return;
    }
    
    // Handle all other requests with cache-first strategy
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached response if found
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Otherwise, fetch from network
                return fetch(request)
                    .then((networkResponse) => {
                        // Cache the response for future use
                        if (isCacheable(request, networkResponse)) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                });
                        }
                        
                        return networkResponse;
                    })
                    .catch(() => {
                        // If offline and no cache, show offline page for HTML requests
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // For other requests, return a fallback
                        return getFallbackResponse(request);
                    });
            })
    );
});

// ==================== API REQUEST HANDLER ====================
function handleApiRequest(request) {
    const url = new URL(request.url);
    
    return caches.open(API_CACHE_NAME)
        .then((cache) => {
            return fetch(request)
                .then((networkResponse) => {
                    // Cache successful API responses
                    if (networkResponse.ok) {
                        const responseToCache = networkResponse.clone();
                        cache.put(request, responseToCache);
                        
                        // Set cache expiration headers
                        const headers = new Headers(networkResponse.headers);
                        headers.set('X-Cache-Date', new Date().toISOString());
                        headers.set('X-Cache-Expires', new Date(Date.now() + 5 * 60 * 1000).toISOString()); // 5 minutes
                        
                        return new Response(networkResponse.body, {
                            status: networkResponse.status,
                            statusText: networkResponse.statusText,
                            headers: headers
                        });
                    }
                    
                    return networkResponse;
                })
                .catch((error) => {
                    console.log('🌐 Network failed, trying cache...', error);
                    
                    // Try to serve from cache if network fails
                    return cache.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                console.log('✅ Serving API response from cache');
                                
                                // Add cache indicator header
                                const headers = new Headers(cachedResponse.headers);
                                headers.set('X-Served-From-Cache', 'true');
                                headers.set('X-Cache-Date', new Date().toISOString());
                                
                                return new Response(cachedResponse.body, {
                                    status: cachedResponse.status,
                                    statusText: cachedResponse.statusText,
                                    headers: headers
                                });
                            }
                            
                            // If no cache, return error
                            return new Response(
                                JSON.stringify({
                                    status: 'error',
                                    message: 'You are offline and no cached data is available.',
                                    offline: true
                                }),
                                {
                                    status: 503,
                                    headers: { 'Content-Type': 'application/json' }
                                }
                            );
                        });
                });
        });
}

// ==================== IMAGE REQUEST HANDLER ====================
function handleImageRequest(request) {
    return caches.match(request)
        .then((cachedResponse) => {
            // Return cached image if available
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Otherwise, fetch from network
            return fetch(request)
                .then((networkResponse) => {
                    // Cache the image
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    
                    return networkResponse;
                })
                .catch(() => {
                    // Return a placeholder image if fetch fails
                    return getImagePlaceholder();
                });
        });
}

// ==================== BACKGROUND SYNC ====================
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync:', event.tag);
    
    if (event.tag === 'sync-contact-form') {
        event.waitUntil(syncContactForms());
    }
    
    if (event.tag === 'sync-analytics') {
        event.waitUntil(syncAnalytics());
    }
});

// ==================== PUSH NOTIFICATIONS ====================
self.addEventListener('push', (event) => {
    console.log('🔔 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Portfolio Update', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification click:', event.action);
    
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    // Handle notification click
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                // If a window is already open, focus it
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // Otherwise, open a new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// ==================== HELPER FUNCTIONS ====================
function isApiRequest(url) {
    // Check if the request is to our GAS API
    return url.href.includes('script.google.com') || 
           API_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint));
}

function isImageRequest(request) {
    return request.destination === 'image' ||
           request.url.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i);
}

function isCacheable(request, response) {
    // Don't cache non-GET requests
    if (request.method !== 'GET') return false;
    
    // Don't cache partial responses
    if (response.status === 206) return false;
    
    // Don't cache responses with no-store header
    if (response.headers.get('Cache-Control')?.includes('no-store')) return false;
    
    // Cache successful responses
    return response.ok;
}

function getFallbackResponse(request) {
    // Return appropriate fallback based on request type
    if (request.destination === 'image') {
        return getImagePlaceholder();
    }
    
    if (request.headers.get('accept').includes('text/html')) {
        return caches.match(OFFLINE_URL);
    }
    
    if (request.headers.get('accept').includes('application/json')) {
        return new Response(
            JSON.stringify({ error: 'Offline', message: 'No internet connection' }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
    
    // Generic fallback
    return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

function getImagePlaceholder() {
    // Return a SVG placeholder image
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <rect width="400" height="300" fill="#f3f4f6"/>
            <path d="M100,100 L300,100 L300,200 L100,200 Z" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/>
            <circle cx="200" cy="150" r="40" fill="#d1d5db"/>
            <path d="M150,120 L250,120 M150,180 L250,180" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
    
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400'
        }
    });
}

// ==================== SYNC FUNCTIONS ====================
async function syncContactForms() {
    console.log('📨 Syncing contact forms...');
    
    // Get stored offline submissions
    const db = await openDatabase();
    const submissions = await getAllFromStore(db, 'contactSubmissions');
    
    for (const submission of submissions) {
        try {
            // Send submission to server
            const response = await fetch('YOUR_GAS_WEB_APP_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'submitContact',
                    ...submission.data
                })
            });
            
            if (response.ok) {
                // Remove from local storage if successful
                await deleteFromStore(db, 'contactSubmissions', submission.id);
                console.log(`✅ Submitted: ${submission.data.name}`);
            }
        } catch (error) {
            console.error('❌ Failed to sync submission:', error);
        }
    }
}

async function syncAnalytics() {
    console.log('📊 Syncing analytics...');
    
    const db = await openDatabase();
    const events = await getAllFromStore(db, 'analyticsEvents');
    
    for (const event of events) {
        try {
            await fetch('YOUR_GAS_WEB_APP_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'logAnalytics',
                    ...event.data
                })
            });
            
            // Remove after successful sync
            await deleteFromStore(db, 'analyticsEvents', event.id);
        } catch (error) {
            console.error('Failed to sync analytics event:', error);
        }
    }
}

// ==================== INDEXEDDB HELPERS ====================
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('PortfolioDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object stores
            if (!db.objectStoreNames.contains('contactSubmissions')) {
                db.createObjectStore('contactSubmissions', { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains('analyticsEvents')) {
                db.createObjectStore('analyticsEvents', { keyPath: 'id' });
            }
            
            if (!db.objectStoreNames.contains('cacheData')) {
                db.createObjectStore('cacheData', { keyPath: 'key' });
            }
        };
    });
}

function getAllFromStore(db, storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

function deleteFromStore(db, storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

// ==================== PERIODIC SYNC ====================
if ('periodicSync' in self.registration) {
    const periodicSync = self.registration.periodicSync;
    
    periodicSync.register('update-content', {
        minInterval: 24 * 60 * 60 * 1000 // 24 hours
    }).then(() => {
        console.log('⏰ Periodic sync registered');
    }).catch((error) => {
        console.error('Periodic sync failed:', error);
    });
}

// ==================== MESSAGE HANDLER ====================
self.addEventListener('message', (event) => {
    console.log('📨 Service Worker received message:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
    
    if (event.data.type === 'GET_CACHE_INFO') {
        caches.keys().then((cacheNames) => {
            const info = {
                cacheNames: cacheNames,
                version: '4.0.0',
                timestamp: new Date().toISOString()
            };
            event.ports[0].postMessage(info);
        });
    }
});

// ==================== ERROR HANDLING ====================
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

// ==================== LOGGING UTILITY ====================
function logToConsole(message, level = 'info') {
    const styles = {
        info: 'color: #3b82f6; font-weight: bold;',
        success: 'color: #10b981; font-weight: bold;',
        warning: 'color: #f59e0b; font-weight: bold;',
        error: 'color: #ef4444; font-weight: bold;'
    };
    
    console.log(`%c[SW ${level.toUpperCase()}] ${message}`, styles[level] || styles.info);
}

// Initialize logging
logToConsole('Service Worker loaded', 'success');

// ==================== EXPORT (for testing) ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CACHE_NAME,
        PRECACHE_ASSETS,
        isApiRequest,
        isImageRequest,
        handleApiRequest,
        handleImageRequest
    };
}
