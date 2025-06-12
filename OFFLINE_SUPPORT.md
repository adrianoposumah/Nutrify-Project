# Nutrify Offline Support Documentation

## Overview

This implementation provides comprehensive offline support for the Nutrify application using Service Workers, local caching, and progressive enhancement strategies.

## Features

### 1. Service Worker Implementation

- **File**: `public/sw.js`
- **Caching Strategy**: Network-first for API calls, Cache-first for static assets
- **Automatic Updates**: Handles service worker updates with user prompts
- **Offline Fallback**: Custom offline page for navigation requests

### 2. Offline-Aware API Client

- **File**: `src/lib/offlineApiClient.ts`
- **Features**:
  - Memory caching with TTL (Time To Live)
  - Automatic fallback to cached data when offline
  - Service Worker cache integration
  - Network status awareness

### 3. Enhanced Components

#### Navbar (`src/components/main/Navbar.tsx`)

- Shows offline indicator when disconnected
- Maintains full functionality offline (static navigation)

#### Footer (`src/components/main/Footer.tsx`)

- Disables email subscription when offline
- Shows appropriate offline messaging
- Form validation for offline state

#### RecommendationFood (`src/components/features/RecommendationFood.tsx`)

- Displays cached random items when offline
- Enhanced error handling for offline scenarios
- Graceful degradation

### 4. Offline Status Management

- **OfflineStatus**: Global banner showing connection status
- **OfflineIndicator**: Reusable component for offline states
- **useOnlineStatus**: Hook for monitoring connection status

### 5. Cache Management

- **CacheManager**: Utility for managing localStorage and Service Worker caches
- **CacheStatus**: Debug component for monitoring cache sizes
- Automatic cleanup of expired caches

## Technical Implementation

### Service Worker Caches

```javascript
const CACHE_NAME = 'nutrify-v1'; // Static assets
const OFFLINE_CACHE = 'nutrify-offline-v1'; // Offline fallbacks
const API_CACHE = 'nutrify-api-v1'; // API responses
```

### Cached Assets

- Navigation components (Navbar, Footer)
- Logo and social media icons
- PWA icons and manifest
- Random food items data
- Static CSS and JavaScript files

### API Endpoints Cached

- `/random-items` - Food recommendations
- `/items` - Food database
- `/display-ingredients` - Ingredients list

### Cache Expiry

- Random Items: 24 hours
- User Preferences: 7 days
- Navigation Data: 1 hour
- API Responses: 5 minutes (memory cache)

## Usage

### For Developers

#### Check Online Status

```typescript
import { useOnlineStatus } from '@/hooks/useOffline';

const MyComponent = () => {
  const isOnline = useOnlineStatus();
  // Component logic
};
```

#### Use Offline Indicator

```typescript
import OfflineIndicator from '@/components/features/OfflineIndicator';

<OfflineIndicator showRetryButton={true} onRetry={() => refetchData()} />;
```

#### Cache Management

```typescript
import { CacheManager } from '@/utils/cacheManager';

// Set cache
CacheManager.setCache('my-key', data, 3600000); // 1 hour

// Get cache
const cachedData = CacheManager.getCache('my-key');

// Clear specific cache
CacheManager.clearCache('my-key');
```

### For Users

#### Offline Capabilities

- Browse cached food items
- Navigate between pages
- View previously loaded content
- Receive offline notifications

#### When Offline

- Email subscription is disabled
- New content requests show cached data
- Visual indicators show offline status
- Automatic retry when connection restored

## Browser Support

### Service Worker Support

- Chrome 45+
- Firefox 44+
- Safari 11.1+
- Edge 17+

### Cache API Support

- Chrome 40+
- Firefox 41+
- Safari 11.1+
- Edge 16+

## Performance Benefits

### Faster Loading

- Static assets served from cache
- API responses cached in memory
- Reduced server requests

### Bandwidth Savings

- Assets loaded once, cached forever
- API responses cached temporarily
- No redundant network requests

### Better UX

- App works offline
- Instant navigation
- Graceful error handling
- Visual feedback for connection status

## Debugging

### Cache Status Component

Include `<CacheStatus />` in development to monitor:

- Connection status
- Service Worker status
- Cache sizes
- Cache management tools

### Browser DevTools

1. Open DevTools → Application tab
2. Check Service Workers section
3. View Cache Storage
4. Monitor Network requests

### Console Logging

Service Worker logs all cache operations:

```
Service Worker installing...
Caching static assets...
Network failed, trying cache: /api/random-items
Random items cached for offline use
```

## Best Practices

### For Development

1. Test offline scenarios regularly
2. Monitor cache sizes
3. Clear caches during development
4. Validate Service Worker updates

### For Production

1. Version cache names appropriately
2. Monitor cache hit rates
3. Set appropriate TTL values
4. Handle cache failures gracefully

## Troubleshooting

### Service Worker Not Registering

- Check HTTPS requirement (localhost is exempt)
- Verify file path: `/sw.js`
- Check browser console for errors

### Caches Not Working

- Verify Service Worker is active
- Check cache names consistency
- Ensure proper error handling

### Offline Functionality Issues

- Test network disconnection simulation
- Verify fallback strategies
- Check cache expiration times

## Future Enhancements

### Background Sync

- Queue failed requests when offline
- Sync when connection restored
- Implement retry strategies

### Push Notifications

- Notify users of new content
- Update availability alerts
- Engagement notifications

### Enhanced Caching

- Predictive caching
- User behavior analysis
- Dynamic cache strategies
