'use client';

import React from 'react';
import { useOnlineStatus } from '@/hooks/useOffline';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineIndicatorProps {
  showRetryButton?: boolean;
  onRetry?: () => void;
  className?: string;
}

export default function OfflineIndicator({ showRetryButton = false, onRetry, className = '' }: OfflineIndicatorProps) {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className={`flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
      <div className="flex items-center space-x-3">
        <WifiOff className="h-5 w-5 text-yellow-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800">You&apos;re currently offline</p>
          <p className="text-xs text-yellow-600">Some features may not be available. We&apos;ll show cached content when possible.</p>
        </div>
        {showRetryButton && onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="text-yellow-700 border-yellow-300 hover:bg-yellow-100">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
