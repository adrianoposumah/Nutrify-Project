'use client';

import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine);

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
}

export function useServiceWorker() {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const isServiceWorkerSupported = 'serviceWorker' in navigator;
    setIsSupported(isServiceWorkerSupported);

    if (isServiceWorkerSupported) {
      // Check for existing registration
      navigator.serviceWorker.getRegistration().then((reg) => {
        setIsRegistered(!!reg);
        setRegistration(reg || null);
      });

      // Listen for service worker registration changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        navigator.serviceWorker.getRegistration().then((reg) => {
          setIsRegistered(!!reg);
          setRegistration(reg || null);
        });
      });
    }
  }, []);

  return { isSupported, isRegistered, registration };
}
