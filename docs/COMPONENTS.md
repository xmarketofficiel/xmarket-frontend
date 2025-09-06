# XMarket Component Documentation

This document provides comprehensive documentation for all components in the XMarket application.

## Core Components

### Feed Component
**File**: `components/Feed.tsx`

The main feed component that displays items with infinite scroll, search, and filtering capabilities.

**Props**: None (uses internal state and context)

**Features**:
- Infinite scroll pagination
- Category filtering
- Search functionality
- Loading states with skeleton cards
- Error handling with retry
- Real-time updates

**Usage**:
```tsx
import Feed from '@/components/Feed';

<Feed />
```

**Dependencies**:
- `SearchBar` - For search functionality
- `CategoryFilter` - For category filtering
- `ItemCard` - For displaying individual items
- `SkeletonCard` - For loading states

**State Management**:
- Uses `useState` for local state (items, loading, pagination)
- Integrates with `FavoritesContext` for favorite items
- Uses `apiEndpoints.getItems()` for data fetching

---

### ItemCard Component
**File**: `components/ItemCard.tsx`

Displays individual item information in a card format with favorite toggle and navigation.

**Props**:
```tsx
interface Props {
  item: Item;
  onClick?: () => void;
}
```

**Features**:
- Image display with fallback
- Price formatting (EGP currency)
- Favorite toggle with heart icon
- Seller information display
- Relative time formatting
- Keyboard navigation support
- Category badge

**Usage**:
```tsx
import ItemCard from '@/components/ItemCard';

<ItemCard item={item} onClick={() => router.push(`/item/${item.id}`)} />
```

**Accessibility**:
- ARIA labels for screen readers
- Keyboard navigation (Enter/Space)
- Focus management
- Alt text for images

---

### AddItemForm Component
**File**: `components/AddItemForm.tsx`

Multi-step form for adding new items with photo upload and validation.

**Props**: None

**Features**:
- Multi-step wizard (photos → details)
- Drag & drop file upload
- Image preview with removal
- Form validation with Zod schema
- Character counting
- Price formatting
- Category selection
- Progress indicator

**Usage**:
```tsx
import AddItemForm from '@/components/AddItemForm';

<AddItemForm />
```

**Validation Schema**:
- Title: 5-100 characters
- Description: 20-1000 characters
- Price: Required positive number
- Photos: At least 1 image required
- Category: Required selection

**File Upload**:
- Supports JPEG, PNG, WebP
- Maximum 5 images
- 10MB per file limit
- Automatic compression and resizing

---

### SearchBar Component
**File**: `components/SearchBar.tsx`

Search input with real-time suggestions and keyboard navigation.

**Props**:
```tsx
interface Props {
  placeholder?: string;
  onSearch?: (query: string) => void;
}
```

**Features**:
- Real-time search suggestions
- Keyboard navigation (Arrow keys, Enter, Escape)
- Debounced API calls (300ms)
- Search history
- Highlight matching text
- Category suggestions
- Recent searches

**Usage**:
```tsx
import SearchBar from '@/components/SearchBar';

<SearchBar 
  placeholder="Search for items..." 
  onSearch={(query) => handleSearch(query)}
/>
```

**Keyboard Controls**:
- `↑/↓`: Navigate suggestions
- `Enter`: Select highlighted suggestion
- `Escape`: Close suggestions
- `Tab`: Close suggestions and move focus

---

### Chat Component
**File**: `components/Chat.tsx`

Real-time messaging interface for buyer-seller communication.

**Props**:
```tsx
interface Props {
  conversationId: string;
  otherUser: User;
}
```

**Features**:
- Real-time message updates
- Message status indicators (Sent, Delivered, Read)
- Online/offline status
- Message timestamps
- Character limit (1000 chars)
- Auto-scroll to bottom
- Message retry on failure

**Usage**:
```tsx
import Chat from '@/components/Chat';

<Chat 
  conversationId="conv123" 
  otherUser={sellerUser}
/>
```

**Message States**:
- `sending`: Message being sent
- `sent`: Message sent to server
- `delivered`: Message delivered to recipient
- `read`: Message read by recipient
- `failed`: Message failed to send

---

### CategoryFilter Component
**File**: `components/CategoryFilter.tsx`

Horizontal scrolling category filter with active state management.

**Props**:
```tsx
interface Props {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}
```

**Categories**:
- All Items
- Electronics
- Furniture
- Clothing
- Books
- Sports
- Other

**Usage**:
```tsx
import CategoryFilter from '@/components/CategoryFilter';

<CategoryFilter 
  selectedCategory={category}
  onCategoryChange={setCategory}
/>
```

**Features**:
- Horizontal scroll on mobile
- Active state styling
- Touch-friendly on mobile
- Keyboard navigation

---

### Navbar Component
**File**: `components/Navbar.tsx`

Bottom navigation bar with route highlighting and user context.

**Props**: None

**Routes**:
- Home (`/`)
- Favorites (`/favorites`)
- Add Item (`/add`)
- Messages (`/messages`)
- Profile (`/profile`)

**Features**:
- Active route highlighting
- Badge indicators (message count, favorites count)
- User authentication state
- Responsive design
- Touch-friendly buttons

**Usage**:
```tsx
import Navbar from '@/components/Navbar';

<Navbar />
```

---

## UI Components

### Button Component
**File**: `components/ui/button.tsx`

Reusable button component with multiple variants and sizes.

**Variants**:
- `default`: Primary blue button
- `destructive`: Red button for delete actions
- `outline`: Outlined button
- `secondary`: Secondary gray button
- `ghost`: Transparent button
- `link`: Link-styled button

**Sizes**:
- `default`: Standard size
- `sm`: Small size
- `lg`: Large size
- `icon`: Square icon button

**Usage**:
```tsx
import { Button } from '@/components/ui/button';

<Button variant="outline" size="sm">
  Click me
</Button>
```

### Card Component
**File**: `components/ui/card.tsx`

Container component with consistent styling and shadows.

**Sub-components**:
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Usage**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### Input Component
**File**: `components/ui/input.tsx`

Styled input field with consistent design.

**Usage**:
```tsx
import { Input } from '@/components/ui/input';

<Input 
  type="text"
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Avatar Component
**File**: `components/ui/avatar.tsx`

User profile picture display with fallback initials.

**Sub-components**:
- `Avatar`: Container
- `AvatarImage`: Image element
- `AvatarFallback`: Fallback content (initials)

**Usage**:
```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src={user.avatar} alt={user.name} />
  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

## Utility Components

### SkeletonCard Component
**File**: `components/SkeletonCard.tsx`

Loading placeholder that mimics the ItemCard structure.

**Usage**:
```tsx
import SkeletonCard from '@/components/SkeletonCard';

{loading && (
  <div className="grid grid-cols-2 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)}
```

### ToastProvider Component
**File**: `components/ToastProvider.tsx`

Global toast notification system.

**Toast Types**:
- `success`: Green toast for success messages
- `error`: Red toast for error messages
- `warning`: Yellow toast for warnings
- `info`: Blue toast for information

**Usage** (via context):
```tsx
import { useToast } from '@/contexts/ToastContext';

const { addToast } = useToast();

addToast('Item saved successfully!', 'success');
```

## PWA Components

### PWAInstallPrompt Component
**File**: `components/PWAInstallPrompt.tsx`

Custom install prompt for Progressive Web App.

**Features**:
- Detects if app is installable
- Shows after user interaction
- Remembers if user dismissed
- Platform-specific styling

### OfflineStatus Component
**File**: `components/OfflineStatus.tsx`

Shows network status and queued offline actions.

**Features**:
- Online/offline detection
- Shows queued background sync actions
- Temporary notifications when coming back online

## Component Guidelines

### Best Practices

1. **TypeScript**: All components use strict TypeScript typing
2. **Accessibility**: Components include ARIA labels and keyboard navigation
3. **Error Boundaries**: Critical components handle their own errors
4. **Loading States**: All data-fetching components show loading states
5. **Responsive**: All components work on mobile and desktop
6. **Performance**: Components use React.memo where appropriate

### File Structure
```
components/
├── ui/               # Reusable UI primitives
├── [Component].tsx   # Main components
└── providers/        # Context providers
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ItemCard.tsx`)
- **Utilities**: camelCase (e.g., `formatPrice.ts`)
- **Contexts**: PascalCase + "Context" (e.g., `UserContext.tsx`)
- **Hooks**: camelCase + "use" prefix (e.g., `useToast.ts`)

### Import Patterns
```tsx
// External libraries
import React from 'react';
import { useRouter } from 'next/navigation';

// UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Custom components
import ItemCard from '@/components/ItemCard';

// Contexts and hooks
import { useToast } from '@/contexts/ToastContext';

// Types
import { Item, User } from '@/types';
```

This documentation serves as a reference for developers working on the XMarket application, providing clear guidance on component usage, props, and integration patterns.
