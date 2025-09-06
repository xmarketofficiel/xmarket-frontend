# XMarket Frontend Cross-Cutting Concerns

## 🎨 Design System

### Color Palette
```css
/* Primary Colors (UM6P Branding) */
--primary: 214 100% 45%        /* UM6P Blue #0066e6 */
--primary-foreground: 210 40% 98%

/* Secondary Colors */
--secondary: 210 40% 96%       /* Light Blue Gray */
--secondary-foreground: 222.2 84% 4.9%

/* Accent Colors */
--accent: 210 40% 96%          /* Subtle Blue */
--accent-foreground: 222.2 84% 4.9%

/* Status Colors */
--success: 142 76% 36%         /* Green */
--warning: 38 92% 50%          /* Amber */
--destructive: 0 84% 60%       /* Red */

/* Neutral Colors */
--background: 0 0% 100%        /* White */
--foreground: 222.2 84% 4.9%   /* Dark Gray */
--muted: 210 40% 96%           /* Light Gray */
--border: 214.3 31.8% 91.4%    /* Border Gray */
```

### Typography
```css
/* Font Family */
font-family: Inter, system-ui, -apple-system, sans-serif;

/* Font Scale */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
```

### Spacing System
```css
/* Spacing Scale (Tailwind CSS) */
--spacing-1: 0.25rem    /* 4px */
--spacing-2: 0.5rem     /* 8px */
--spacing-3: 0.75rem    /* 12px */
--spacing-4: 1rem       /* 16px */
--spacing-5: 1.25rem    /* 20px */
--spacing-6: 1.5rem     /* 24px */
--spacing-8: 2rem       /* 32px */
--spacing-10: 2.5rem    /* 40px */
--spacing-12: 3rem      /* 48px */
--spacing-16: 4rem      /* 64px */
```

### Component Standards
- **Border Radius**: `rounded-lg` (8px) for cards, `rounded-full` for buttons
- **Shadow**: `shadow-sm` for subtle elevation, `shadow-md` for cards
- **Touch Targets**: Minimum 44px for mobile interactions
- **Focus States**: Blue ring with 2px offset for accessibility

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: 640px     /* Small devices (landscape phones) */
md: 768px     /* Medium devices (tablets) */
lg: 1024px    /* Large devices (laptops) */
xl: 1280px    /* Extra large devices (desktop) */
2xl: 1536px   /* 2X Extra large devices (large desktop) */
```

### Layout Patterns
- **Mobile**: Single column, bottom navigation
- **Tablet**: Two columns with sidebar navigation
- **Desktop**: Three columns with top navigation

### Touch Interactions
- **Minimum Touch Target**: 44px × 44px
- **Gesture Support**: Swipe for photo carousels, pull-to-refresh
- **Haptic Feedback**: Visual feedback for all interactions

## 🔧 TypeScript Interfaces

### Core Data Models
```typescript
// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  program: string;
  year: string;
  verified: boolean;
  bio?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Item Interface
export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ItemCondition;
  images: string[];
  sellerId: string;
  seller: User;
  location?: string;
  tags: string[];
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

// Message Interface
export interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  type: MessageType;
  timestamp: string;
  readAt?: string;
  attachments?: string[];
}

// Conversation Interface
export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  item?: Item;
  createdAt: string;
  updatedAt: string;
}

// Service Interface (New)
export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  providerId: string;
  provider: User;
  location?: string;
  rating: number;
  totalRatings: number;
  availability: string;
  createdAt: string;
  updatedAt: string;
}

// Interest Interface (New)
export interface Interest {
  id: number;
  userId: number;
  itemId: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Enumeration Types
```typescript
export enum ItemCondition {
  NEW = 'New',
  LIKE_NEW = 'Like New',
  GOOD = 'Good',
  FAIR = 'Fair'
}

export enum ItemStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RESERVED = 'reserved'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  SYSTEM = 'system'
}

export enum ServiceCategory {
  CLEANER = 'cleaner',
  TUTOR = 'tutor',
  DELIVERY = 'delivery',
  MAINTENANCE = 'maintenance',
  PET_CARE = 'pet_care',
  OTHER = 'other'
}
```

### API Response Types
```typescript
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}
```

## 🔐 Authentication & Security

### Authentication Flow
1. **OTP Registration**: Email verification with one-time password
2. **Cookie-based JWT**: HTTP-only cookies for secure token storage
3. **Token Refresh**: Automatic refresh using refresh token cookie
4. **Session Management**: Secure logout with cookie clearing

### Security Patterns
```typescript
// API Client Configuration
const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  credentials: 'include', // Include cookies
  timeout: 10000,
  retries: 3
});

// Authentication Headers
headers: {
  'Content-Type': 'application/json',
  // JWT tokens handled via HTTP-only cookies
  // No Authorization header needed
}
```

### Data Protection
- **XSS Prevention**: HTTP-only cookies, content sanitization
- **CSRF Protection**: SameSite cookie attributes
- **Input Validation**: Zod schema validation on all forms
- **Error Handling**: No sensitive information in client errors

## 🎭 State Management

### Context Providers
```typescript
// User Context
interface UserContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Favorites/Interests Context
interface FavoritesContextType {
  favorites: string[];
  interests: Interest[];
  toggleFavorite: (itemId: string) => Promise<void>;
  showInterest: (itemId: string, message?: string) => Promise<void>;
  removeInterest: (interestId: string) => Promise<void>;
}

// Toast Context
interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
  toasts: Toast[];
}

// UI Context
interface UIContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
```

### State Patterns
- **Optimistic Updates**: UI updates immediately, rollback on error
- **Loading States**: Global and component-level loading indicators
- **Error Boundaries**: Graceful error handling with fallback UI
- **Context Composition**: Multiple providers for separation of concerns

## 📡 API Patterns

### HTTP Client
```typescript
class ApiClient {
  private config: ApiConfig;
  
  constructor(config: ApiConfig) {
    this.config = config;
  }

  // Generic request method with retry logic
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>>;

  // HTTP Methods
  async get<T>(endpoint: string, params?: unknown): Promise<ApiResponse<T>>;
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>>;
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>>;
  async delete<T>(endpoint: string): Promise<ApiResponse<T>>;
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>>;
}
```

### Error Handling
```typescript
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor({ message, status, code, details }: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
```

### Endpoint Organization
```typescript
// Grouped by feature
export const api = {
  auth: authApi,
  items: itemsApi,
  users: usersApi,
  services: servicesApi,    // New: Services marketplace
  interests: interestsApi,  // New: Interest tracking
  uploads: uploadsApi,      // New: File uploads
  messages: messagesApi,    // Mock: Until backend implements
  search: searchApi,        // Partial: Basic search only
  categories: categoriesApi,
  notifications: notificationsApi // Mock: Until backend implements
};
```

## 📱 PWA Configuration

### Service Worker Strategy
```javascript
// Offline-first caching strategy
workbox.routing.registerRoute(
  /^https:\/\/api\./,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3
  })
);

// Background sync for offline actions
workbox.backgroundSync.registerBackgroundSync('api-queue', {
  onSync: ({ queue }) => queue.replayRequests()
});
```

### App Manifest
```json
{
  "name": "XMarket - University Marketplace",
  "short_name": "XMarket",
  "description": "Buy, sell, and trade on your university campus",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0066e6",
  "orientation": "portrait-primary"
}
```

### Installation Prompts
- **Custom Install Banner**: Native-feeling install experience
- **Dismissal Handling**: Respect user choice, don't spam prompts
- **Platform Detection**: Different prompts for iOS vs Android
- **Installation Events**: Track install/uninstall metrics

## ⚡ Performance Standards

### Bundle Size Targets
- **Main Bundle**: < 250KB (achieved: 6.55KB)
- **Shared JS**: < 150KB (achieved: 102KB)
- **Route Bundles**: < 50KB each (achieved: all under 10KB)
- **Image Assets**: WebP format, lazy loading

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s

### Loading Strategies
- **Critical CSS**: Inlined for above-fold content
- **Code Splitting**: Route-based and component-based
- **Lazy Loading**: Images, components, and routes
- **Preloading**: Critical routes and resources

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Management**: Visible focus indicators, logical tab order
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Reader**: Proper ARIA labels, roles, and states

### Accessibility Features
```typescript
// ARIA Attributes
aria-label="Add item to favorites"
aria-describedby="price-help-text"
role="button"
aria-expanded={isOpen}
aria-live="polite"

// Focus Management
const focusRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  focusRef.current?.focus();
}, [isOpen]);

// Keyboard Shortcuts
useKeyboardShortcuts({
  'ctrl+h': () => navigate('/'),
  'ctrl+f': () => navigate('/favorites'),
  'ctrl+a': () => navigate('/add'),
  'escape': () => closeModal()
});
```

### Testing Tools
- **axe-core**: Automated accessibility testing
- **Lighthouse**: Accessibility audit scores
- **Screen Reader**: Manual testing with NVDA/VoiceOver
- **Keyboard Only**: Navigation testing without mouse

## 🧪 Testing Strategy

### Testing Pyramid
```
┌─────────────────────────┐
│     E2E Tests (10%)     │ ← Playwright
├─────────────────────────┤
│ Integration Tests (20%) │ ← React Testing Library
├─────────────────────────┤
│   Unit Tests (70%)      │ ← Jest + RTL
└─────────────────────────┘
```

### Test Configuration
```typescript
// Jest Configuration
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts'
  ]
};

// Test Utilities
const renderWithProviders = (ui: ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <UserContextProvider>
        <ToastProvider>
          <FavoritesContextProvider>
            {children}
          </FavoritesContextProvider>
        </ToastProvider>
      </UserContextProvider>
    )
  });
};
```

### Testing Standards
- **Unit Tests**: All utilities, hooks, and critical components
- **Integration Tests**: User flows and component interactions
- **E2E Tests**: Critical business paths (browse, buy, sell, message)
- **Visual Regression**: Screenshot comparison for UI consistency

## 🔄 Development Workflow

### Git Strategy
- **Branch Naming**: `feature/backend-integration`, `fix/hydration-mismatch`
- **Commit Messages**: Conventional commits format
- **PR Reviews**: Required for all changes
- **CI/CD**: Automated testing and deployment

### Code Quality
- **ESLint**: TypeScript-specific rules, accessibility rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for linting and testing
- **TypeScript**: Strict mode enabled

### Environment Configuration
```bash
# Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
PWA_ENABLED=false

# Production
NEXT_PUBLIC_API_BASE_URL=https://api.xmarket.university
NEXT_PUBLIC_APP_URL=https://xmarket.university
PWA_ENABLED=true
```

---

*Cross-cutting concerns maintained for backend developer collaboration*
*Shared standards ensure consistent implementation across frontend/backend*
*Last updated: 2025-08-25*
