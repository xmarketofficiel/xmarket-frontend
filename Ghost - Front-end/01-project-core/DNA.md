# Frontend Architecture (DNA)

## 🧬 Project DNA
**xmarket Frontend** - Mobile-first React marketplace for UM6P students

### Core Philosophy
- **Mobile-First**: Design and develop for mobile, enhance for desktop
- **Component-Driven**: Reusable, composable UI components
- **Type-Safe**: Full TypeScript coverage with no `any` types
- **Performance-First**: Optimized loading, lazy loading, skeleton states
- **Accessible**: WCAG 2.1 AA compliance built-in

## 🏗️ Architecture Overview

### Framework & Build
- **Next.js 13.5.1** (App Router) - React meta-framework
- **TypeScript 5.2.2** - Type safety and developer experience
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **ESLint** - Code quality and consistency

### State Management Strategy
```typescript
// Global State: React Context API
- UserContext: Current authenticated user
- FavoritesContext: Saved items (localStorage persistence)
- ToastContext: User feedback notifications

// Local State: useState/useReducer for component-specific state
// Future: React Query for server state management
```

### Component Architecture
```
components/
├── ui/                    # shadcn/ui primitives (buttons, inputs, etc.)
├── Navbar.tsx            # Bottom navigation (5 tabs)
├── Feed.tsx              # Item grid with infinite scroll
├── ItemCard.tsx          # Reusable item display card
├── ItemDetail.tsx        # Full item view with actions
├── AddItemForm.tsx       # Item creation form
├── Chat.tsx              # Messaging interface
├── SearchBar.tsx         # Search with filters
├── CategoryFilter.tsx    # Horizontal category chips
├── FavoritesList.tsx     # Saved items display
├── SkeletonCard.tsx      # Loading states
└── ToastProvider.tsx     # Global notification system
```

### Page Structure (App Router)
```
app/
├── page.tsx              # Home feed (default route)
├── layout.tsx            # Root layout with providers
├── globals.css           # Global styles and CSS variables
├── item/[id]/page.tsx    # Dynamic item detail pages
├── add/page.tsx          # Item creation form
├── favorites/page.tsx    # User's saved items
├── messages/page.tsx     # Chat inbox and threads
└── profile/page.tsx      # User profile and settings
```

### Data Flow Pattern
```typescript
// Mock Data Layer (utils/mockData.ts)
export const mockItems: Item[] = [...];
export const mockUsers: User[] = [...];
export const mockConversations: Conversation[] = [...];

// Context Providers (app/layout.tsx)
<UserProvider>
  <FavoritesProvider>
    <ToastProvider>
      {children}
    </ToastProvider>
  </FavoritesProvider>
</UserProvider>

// Component Consumption
const { user } = useUserContext();
const { favorites, addFavorite } = useFavoritesContext();
const { showToast } = useToastContext();
```

## 🎨 Design System Implementation

### Color System (Tailwind Config)
```javascript
// tailwind.config.ts
colors: {
  primary: '#006666',      // UM6P Teal
  accent: '#FF6B35',       // Orange CTAs
  neutral: {
    0: '#FFFFFF',
    50: '#F8F9FA',
    900: '#495057'
  }
}
```

### Typography Scale
- **Headings**: `font-semibold` to `font-bold` (600-700)
- **Body**: `font-normal` (400)
- **Mobile Base**: 16px with responsive scaling
- **Font Stack**: Inter (loaded via Next.js fonts)

### Component Patterns
```typescript
// Consistent button styling
<Button className="w-full lg:w-auto rounded-xl">
  Action
</Button>

// Card pattern for items
<Card className="overflow-hidden shadow-sm">
  <CardContent className="p-0">
    {/* Image */}
  </CardContent>
</Card>

// Mobile-first responsive grid
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```

## 🚀 Performance Architecture

### Code Splitting
- **Automatic**: Next.js App Router automatic code splitting
- **Dynamic Imports**: Heavy components lazy-loaded
- **Image Optimization**: Next.js Image component with lazy loading

### Loading States
```typescript
// Skeleton loading pattern
const [loading, setLoading] = useState(true);

{loading ? (
  <SkeletonCard count={6} />
) : (
  <Feed items={items} />
)}
```

### Bundle Optimization
- **Tree Shaking**: Only imported components bundled
- **Icon Optimization**: lucide-react individual imports
- **CSS Purging**: Tailwind unused styles removed

## 📱 Mobile-First Implementation

### Responsive Breakpoints
```css
/* Tailwind breakpoints */
sm: 640px    /* Small tablets */
md: 768px    /* Tablets */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
```

### Navigation Pattern
- **Bottom Tab Bar**: Fixed position, 5 main sections
- **Thumb-Friendly**: 44px minimum touch targets
- **Visual Feedback**: Active states and transitions

### Touch Interactions
- **Swipe**: Photo carousels, dismissible elements
- **Pull-to-Refresh**: Feed updates (future implementation)
- **Long Press**: Context menus (future implementation)

## 🔌 Integration Readiness

### Backend Integration Points
```typescript
// API layer preparation
interface ApiClient {
  items: {
    getAll: (filters?: ItemFilters) => Promise<Item[]>;
    getById: (id: string) => Promise<Item>;
    create: (item: CreateItemRequest) => Promise<Item>;
    update: (id: string, item: UpdateItemRequest) => Promise<Item>;
  };
  users: {
    getProfile: () => Promise<User>;
    updateProfile: (user: UpdateUserRequest) => Promise<User>;
  };
  conversations: {
    getAll: () => Promise<Conversation[]>;
    getById: (id: string) => Promise<Conversation>;
    sendMessage: (message: SendMessageRequest) => Promise<Message>;
  };
}
```

### State Management Evolution
```typescript
// Current: Context API + localStorage
const [favorites, setFavorites] = useState<string[]>([]);

// Future: React Query + API
const { data: favorites, mutate: addToFavorites } = 
  useMutation(api.favorites.add);
```

## 🧪 Testing Strategy (Future)
- **Unit Tests**: Component logic and utilities
- **Integration Tests**: Context providers and user flows  
- **E2E Tests**: Critical user journeys (add item, messaging)
- **Visual Regression**: Component library consistency
