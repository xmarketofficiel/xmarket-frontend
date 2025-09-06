# XMarket Frontend Team Handoff Guide

## 👋 Welcome to XMarket Frontend

This comprehensive guide will get you up and running with the XMarket frontend codebase, whether you're a backend developer, new frontend developer, or team member joining the project.

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

### Initial Setup
```bash
# Clone the repository
git clone [repository-url]
cd xmarket/Front-end

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Verify Setup
- [ ] Development server starts without errors
- [ ] Application loads in browser
- [ ] Navigation works between pages
- [ ] No console errors in browser developer tools

## 📁 Project Structure Overview

```
Front-end/
├── app/                          # Next.js 13+ App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Home page
│   ├── add/page.tsx             # Add item page
│   ├── favorites/page.tsx       # Favorites page
│   ├── item/[id]/page.tsx       # Item details (dynamic route)
│   ├── messages/page.tsx        # Messages page
│   └── profile/page.tsx         # Profile page
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui component library
│   ├── AddItemForm.tsx          # Item creation form
│   ├── ItemCard.tsx             # Item display component
│   ├── Navbar.tsx               # Navigation component
│   └── ...other components
├── contexts/                     # React Context providers
│   ├── UserContext.tsx          # User authentication state
│   ├── FavoritesContext.tsx     # Favorites management
│   └── ToastContext.tsx         # Toast notifications
├── lib/                         # Utility functions and API
│   ├── api.ts                   # HTTP client
│   ├── apiEndpoints.ts          # API endpoint definitions
│   └── utils.ts                 # Shared utilities
├── types.ts                     # TypeScript type definitions
├── Ghost - Front-end/           # 📋 Project documentation
└── package.json                 # Dependencies and scripts
```

## 🧠 Understanding the Architecture

### 1. **Next.js App Router Pattern**
We use Next.js 13+ App Router for file-based routing:
- `app/page.tsx` = `/` (home)
- `app/add/page.tsx` = `/add` 
- `app/item/[id]/page.tsx` = `/item/123` (dynamic routes)

### 2. **Component Architecture**
```typescript
// Example component structure
export default function ItemCard({ item }: { item: Item }) {
  const { toggleFavorite } = useFavorites();
  
  return (
    <Card className="...">
      {/* Component JSX */}
    </Card>
  );
}
```

### 3. **State Management**
We use React Context for global state:
```typescript
// Using context in components
const { user, login, logout } = useUser();
const { favorites, toggleFavorite } = useFavorites();
const { showToast } = useToast();
```

### 4. **API Integration**
All API calls go through our typed client:
```typescript
import { api } from '@/lib/apiEndpoints';

// Usage in components
const items = await api.items.getItems();
const user = await api.auth.login(credentials);
```

## 🔧 Development Workflows

### Adding New Features

#### 1. **New Page**
```bash
# Create new page file
touch app/services/page.tsx

# Add to navigation
# Edit components/Navbar.tsx
```

#### 2. **New Component**
```bash
# Create component file
touch components/ServiceCard.tsx

# Export from component
export default function ServiceCard({ service }: { service: Service }) {
  // Component logic
}
```

#### 3. **New API Endpoint**
```typescript
// Add to lib/apiEndpoints.ts
export const servicesApi = {
  getServices: (params?: SearchParams) => 
    apiClient.get('/services', params),
  createService: (data: CreateServiceData) =>
    apiClient.post('/services', data)
};
```

### Code Style Guidelines

#### TypeScript Patterns
```typescript
// ✅ Good - Explicit interfaces
interface ItemCardProps {
  item: Item;
  onFavorite?: (itemId: string) => void;
}

// ✅ Good - Proper error handling  
try {
  const result = await api.items.createItem(data);
  showToast('Item created successfully!', 'success');
} catch (error) {
  showToast(error.message, 'error');
}

// ❌ Avoid - Any types
const data: any = response.data; // Use proper interfaces instead
```

#### Component Patterns
```typescript
// ✅ Good - Functional components with hooks
export default function ItemCard({ item }: ItemCardProps) {
  const [loading, setLoading] = useState(false);
  const { toggleFavorite } = useFavorites();
  
  const handleFavorite = async () => {
    setLoading(true);
    try {
      await toggleFavorite(item.id);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
}
```

#### Styling Guidelines
```typescript
// ✅ Good - Tailwind CSS classes
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  Add Item
</button>

// ✅ Good - Conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === 'primary' && "primary-class"
)}>
```

## 🎯 Common Tasks

### Working with Forms
```typescript
import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().positive('Price must be positive')
});

export default function ItemForm() {
  const [formData, setFormData] = useState({ title: '', price: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = schema.parse(formData);
      await api.items.createItem(validated);
      // Success handling
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
    }
  };
}
```

### Adding Loading States
```typescript
export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await api.items.getItems();
        setItems(response.data.items);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>; // Or use SkeletonCard component
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### Implementing Navigation
```typescript
import { useRouter } from 'next/navigation';

export default function Component() {
  const router = useRouter();
  
  const handleNavigate = () => {
    router.push('/items/123');
    // or router.replace('/login') for replacing history
  };
  
  return <button onClick={handleNavigate}>View Item</button>;
}
```

## 🧪 Testing Your Changes

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Run specific test file
npm test -- ItemCard.test.tsx

# Watch mode during development
npm test -- --watch
```

### Writing Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import ItemCard from '@/components/ItemCard';

test('displays item information correctly', () => {
  const mockItem = {
    id: '1',
    title: 'Test Item',
    price: 100,
    // ...other properties
  };
  
  renderWithProviders(<ItemCard item={mockItem} />);
  
  expect(screen.getByText('Test Item')).toBeInTheDocument();
  expect(screen.getByText('$100')).toBeInTheDocument();
});
```

## 🔌 Backend Integration Points

### API Configuration
The frontend is configured to work with the CampusSuperApp backend:

```typescript
// lib/api.ts configuration
const apiClient = new ApiClient({
  baseUrl: 'http://localhost:3001', // Backend runs on port 3001
  credentials: 'include', // For cookie-based auth
  timeout: 10000,
  retries: 3
});
```

### Authentication Flow
```typescript
// Cookie-based authentication (handled automatically)
await api.auth.login({ email, password }); // Sets HTTP-only cookies
await api.auth.logout(); // Clears cookies
```

### Key Endpoints
- `POST /auth/login` - User login
- `GET /items` - List items with search/pagination
- `POST /items` - Create new item
- `POST /items/:id/images` - Upload item images
- `GET /users/profile` - Get current user profile

## 🚨 Troubleshooting

### Common Issues

#### 1. **Development Server Won't Start**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

#### 2. **API Connection Errors**
- Check backend is running on port 3001
- Verify CORS configuration allows localhost:3000
- Check network tab in browser developer tools

#### 3. **TypeScript Errors**
```bash
# Check TypeScript errors
npm run type-check

# Common fixes
# - Add missing types to types.ts
# - Import interfaces properly
# - Check for any types
```

#### 4. **Styling Issues**
- Ensure Tailwind CSS is working: check if basic classes like `text-red-500` work
- Clear Next.js cache: `rm -rf .next`
- Check browser developer tools for CSS conflicts

### Getting Help

1. **Check Documentation**: Look in `Ghost - Front-end/` folder first
2. **Search Issues**: Look for similar problems in project issues
3. **Ask Team**: Reach out to team members familiar with the codebase
4. **Debug Tools**: Use React Developer Tools and browser dev tools

## 📚 Key Resources

### Documentation
- `Ghost - Front-end/STATUS.md` - Current project status
- `Ghost - Front-end/TODO.md` - Pending tasks and priorities
- `Ghost - Front-end/DNA.md` - Technical architecture details
- `Ghost - Front-end/DECISIONS.md` - Technical decisions and rationale

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Tools & Extensions
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) - For API testing

## 🎯 Success Checklist

After following this guide, you should be able to:

- [ ] Start the development server successfully
- [ ] Navigate through all pages without errors
- [ ] Understand the component architecture
- [ ] Add a new component with proper TypeScript types
- [ ] Make API calls using the provided client
- [ ] Run tests and see them pass
- [ ] Find and read project documentation
- [ ] Troubleshoot common development issues

## 🚀 Next Steps

1. **Explore the Codebase**: Look through existing components to understand patterns
2. **Run Tests**: Get familiar with the testing setup and run the test suite
3. **Read Documentation**: Go through the Ghost documentation for deeper context
4. **Try Making Changes**: Start with small modifications to get comfortable
5. **Backend Integration**: If working on backend, review the API mapping documentation

## 💡 Pro Tips

### Development Productivity
- Use TypeScript IntelliSense - it knows all our types and APIs
- Install React Developer Tools for debugging component state
- Use the Network tab to debug API calls
- Keep the browser console open to catch errors early

### Code Quality
- Run `npm run type-check` before committing
- Use `npm run lint` to catch style issues  
- Test your changes in both mobile and desktop views
- Check accessibility with browser tools

### Collaboration
- Read existing code before writing new code
- Ask questions about architecture decisions
- Update documentation when adding new features
- Write tests for critical functionality

---

Welcome to the team! We're excited to have you working on XMarket. If you have any questions, don't hesitate to ask. The codebase is well-documented and the team is here to help you succeed.

*Happy coding! 🎉*

---
*Handoff guide maintained for backend developer collaboration*
*Updated for latest project structure and patterns*
*Last updated: 2025-08-25*
