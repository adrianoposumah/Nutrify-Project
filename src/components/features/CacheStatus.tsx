'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CacheManager } from '@/utils/cacheManager';
import { useServiceWorker } from '@/hooks/useOffline';
import { Trash2, HardDrive, Wifi, WifiOff } from 'lucide-react';

export default function CacheStatus() {
  const [localCacheSize, setLocalCacheSize] = useState('0 bytes');
  const [swCacheSize, setSwCacheSize] = useState('0 bytes');
  const [isOnline, setIsOnline] = useState(true);
  const { isSupported, isRegistered } = useServiceWorker();

  useEffect(() => {
    const updateStatus = async () => {
      setLocalCacheSize(CacheManager.getCacheSize());
      setSwCacheSize(await CacheManager.getServiceWorkerCacheSize());
      setIsOnline(navigator.onLine);
    };

    updateStatus();

    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleClearLocalCache = () => {
    CacheManager.clearCache();
    setLocalCacheSize(CacheManager.getCacheSize());
  };

  const handleClearServiceWorkerCache = async () => {
    await CacheManager.clearServiceWorkerCaches();
    setSwCacheSize(await CacheManager.getServiceWorkerCacheSize());
  };

  const handleClearExpiredCaches = () => {
    CacheManager.clearExpiredCaches();
    setLocalCacheSize(CacheManager.getCacheSize());
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
      <h3 className="font-semibold text-lg flex items-center">
        <HardDrive className="h-5 w-5 mr-2" />
        Cache Status
      </h3>

      <div className="space-y-3">
        {/* Online Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isOnline ? <Wifi className="h-4 w-4 text-green-500 mr-2" /> : <WifiOff className="h-4 w-4 text-red-500 mr-2" />}
            <span className="text-sm">Connection Status</span>
          </div>
          <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Service Worker Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Service Worker</span>
          <span className={`text-sm font-medium ${isRegistered ? 'text-green-600' : 'text-yellow-600'}`}>{isSupported ? (isRegistered ? 'Active' : 'Available') : 'Not Supported'}</span>
        </div>

        {/* Local Cache Size */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Local Cache Size</span>
          <span className="text-sm font-medium">{localCacheSize}</span>
        </div>

        {/* Service Worker Cache Size */}
        <div className="flex items-center justify-between">
          <span className="text-sm">SW Cache Size</span>
          <span className="text-sm font-medium">{swCacheSize}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleClearExpiredCaches} className="text-xs">
          Clear Expired
        </Button>
        <Button variant="outline" size="sm" onClick={handleClearLocalCache} className="text-xs">
          <Trash2 className="h-3 w-3 mr-1" />
          Clear Local
        </Button>
        <Button variant="outline" size="sm" onClick={handleClearServiceWorkerCache} className="text-xs">
          <Trash2 className="h-3 w-3 mr-1" />
          Clear SW Cache
        </Button>
      </div>
    </div>
  );
}
