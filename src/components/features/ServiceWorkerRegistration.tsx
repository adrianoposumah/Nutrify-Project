'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          console.log('Registering service worker...');

          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          console.log('Service Worker registered successfully:', registration);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            console.log('Service Worker update found');

            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version is available
                  console.log('New service worker version available');

                  toast.success('New app version available! Refresh to update.', {
                    duration: 5000,
                    position: 'bottom-center',
                  });
                }
              });
            }
          }); // Handle service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
              toast.success('App updated! Please refresh the page.', {
                duration: 5000,
                position: 'bottom-center',
              });
            }
          });

          // Check if there's already a service worker controlling the page
          if (registration.active) {
            console.log('Service Worker is active and controlling the page');
          } // Force activation of waiting service worker on page reload
          if (registration.waiting) {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              if (event.data.success) {
                console.log('Service worker skip waiting successful');
              }
            };
            registration.waiting.postMessage({ type: 'SKIP_WAITING' }, [messageChannel.port2]);
          }
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      };

      // Register service worker when page loads
      registerServiceWorker(); // Handle page reload to activate new service worker
      const handlePageReload = () => {
        if (navigator.serviceWorker.controller) {
          const messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = (event) => {
            if (event.data.success) {
              console.log('Service worker message sent successfully');
            }
          };
          navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' }, [messageChannel.port2]);
        }
      };

      window.addEventListener('beforeunload', handlePageReload);

      return () => {
        window.removeEventListener('beforeunload', handlePageReload);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
