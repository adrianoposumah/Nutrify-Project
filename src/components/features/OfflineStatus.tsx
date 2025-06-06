'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      if (!online) {
        setShowBanner(true);
      } else {
        // Delay hiding the banner to show "back online" message
        setTimeout(() => setShowBanner(false), 3000);
      }
    };

    // Set initial status
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className={cn('fixed top-20 left-0 right-0 z-40 px-4 py-2 text-center text-sm font-medium transition-all duration-300', isOnline ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black')}>
      {isOnline ? <span>✅ Back online! All features are available.</span> : <span>⚠️ You&apos;re offline. Some features may not be available.</span>}
    </div>
  );
}
