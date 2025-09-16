/**
 * Consolidated hooks exports
 * Organized code structure for better maintainability
 */

// Common hooks for API operations
export { useApi, usePaginatedApi } from './useApi';

// Form management
export { useForm } from './useForm';

// Async operations
export { useAsync, useDebouncedAsync, useAsyncQueue } from './useAsync';

// Local storage management
export { useLocalStorage, useSessionStorage, useNamespacedStorage } from './useLocalStorage';

// Existing feature-specific hooks
export { useDebounceSearch } from './useDebounceSearch';
export { useDragAndDrop } from './useDragAndDrop';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export { usePullToRefresh } from './usePullToRefresh';
