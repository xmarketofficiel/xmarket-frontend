# Technical Decisions

## 🎯 Major Technical Choices Made

### Framework Selection
**Decision**: Next.js 13.5.1 with App Router
**Rationale**: 
- Server-side rendering capabilities for SEO and performance
- Built-in API routes for future backend integration
- Automatic code splitting and optimization
- Strong TypeScript support

**Trade-offs**: 
- App Router is newer, less community resources than Pages Router
- Static export limitations with dynamic routes
- Learning curve for developers familiar with Pages Router

### State Management
**Decision**: React Context API (no Redux/Zustand)
**Rationale**:
- Lightweight for MVP scope
- No external dependencies for state management
- Sufficient for user preferences, favorites, and toast notifications
- Easy to migrate to React Query when backend is added

**Trade-offs**:
- Context re-renders all consumers on state change
- No middleware or dev tools like Redux
- May need refactoring for complex state logic

### Styling Framework
**Decision**: Tailwind CSS + shadcn/ui components
**Rationale**:
- Rapid development with utility classes
- Consistent design system through component library
- Mobile-first responsive design built-in
- Easy customization of UM6P brand colors

**Trade-offs**:
- Large class names can reduce readability
- Requires Tailwind knowledge for team members
- Bundle size considerations (mitigated by purging)

### Static Export Configuration
**Decision**: `output: 'export'` in next.config.js
**Rationale**: 
- Generates static files for deployment without Node.js server
- Suitable for CDN deployment (Netlify, Vercel, etc.)
- No backend required for frontend-only MVP

**Issues Identified**:
- Conflicts with dynamic routes (`/item/[id]`)
- Requires generateStaticParams for pre-rendering
- Images optimization disabled

**Recommendation**: Remove static export until backend integration or implement generateStaticParams

### TypeScript Integration
**Decision**: Full TypeScript with strict type checking
**Rationale**:
- Type safety prevents runtime errors
- Better developer experience with autocomplete
- Self-documenting code through interfaces
- Easier refactoring and maintenance

**Implementation**:
- Centralized types in `types.ts`
- No `any` types used (following Ghost System principles)
- Interfaces for User, Item, Message, Conversation entities

### Component Architecture
**Decision**: Functional components with React Hooks
**Rationale**:
- Modern React best practices
- Simplified testing (no class component lifecycle complexity)
- Better performance with React's optimization
- Consistent with Next.js App Router patterns

**Pattern Used**:
```typescript
// Component pattern
const Component = ({ prop }: { prop: Type }) => {
  const [state, setState] = useState<Type>(initialValue);
  return <JSX />;
};
```

### Mock Data Strategy
**Decision**: Static mock data in `utils/mockData.ts`
**Rationale**:
- Complete development environment without backend
- Realistic data for demo purposes
- Easy to swap for API calls during integration
- Consistent data relationships maintained

**Data Structure**:
- 20+ mock items across all categories
- 10+ mock users with UM6P student profiles
- 5+ conversation threads with message history
- Proper foreign key relationships (sellerId, etc.)

### Icon Library
**Decision**: lucide-react icons
**Rationale**:
- Lightweight SVG icons with tree-shaking
- Consistent design language
- Easy to customize with Tailwind classes
- Good mobile optimization

**Alternative Considered**: React Icons (too many options, larger bundle)

### Form Handling
**Decision**: React Hook Form with Zod validation
**Rationale**:
- Better performance than controlled components
- Built-in validation with TypeScript support
- Less re-renders during form input
- Zod provides runtime type validation

**Implementation**: Seen in AddItemForm component

### Storage Strategy
**Decision**: localStorage for favorites persistence
**Rationale**:
- Simple client-side storage for user preferences
- Survives page refreshes and browser sessions
- No server required for MVP functionality
- Easy to migrate to user accounts later

**Limitations**: Data not synchronized across devices

### Error Handling Approach
**Decision**: Toast notifications for user feedback
**Rationale**:
- Non-intrusive user experience
- Consistent feedback pattern across app
- Mobile-friendly notification system

**Gap Identified**: No error boundaries for component crashes

### Navigation Pattern
**Decision**: Bottom tab navigation (mobile-first)
**Rationale**:
- Thumb-friendly for mobile users
- Familiar pattern from native mobile apps
- Always visible for quick navigation
- UM6P students primarily use mobile devices

**Implementation**: Fixed position with 5 main sections

### CSS Architecture
**Decision**: CSS-in-JS avoided, utility-first with Tailwind
**Rationale**:
- Better performance (no runtime CSS generation)
- Easier for designers to understand and modify
- Consistent spacing and color systems
- Smaller bundle size with purging

### Development vs. Production
**Decision**: Different configurations for dev/build
**Rationale**:
- Fast refresh and hot reload for development
- Optimized bundles for production
- Static export for deployment flexibility

**Issue**: Current config causes build failures with dynamic routes

### Accessibility Approach
**Decision**: Built-in accessibility with semantic HTML + ARIA
**Rationale**:
- WCAG 2.1 AA compliance target
- Better user experience for all users
- Semantic HTML provides baseline accessibility

**Implementation**: Needs verification and testing

---

## 🔄 Future Decisions Needed

### Backend Integration
- API client library choice (Axios vs. fetch wrapper)
- Authentication strategy (JWT, sessions, OAuth)
- State management evolution (Context vs. React Query)
- Real-time messaging implementation (WebSockets, Socket.io, SSE)

### Production Deployment
- Hosting platform selection
- CI/CD pipeline setup
- Environment variable management
- Performance monitoring tools

### Testing Strategy
- Unit testing framework (Jest, Vitest)
- E2E testing tools (Playwright, Cypress)
- Component testing approach (React Testing Library)
- Visual regression testing

### Performance Optimization
- Image optimization strategy
- Bundle splitting approach
- Caching strategy
- PWA implementation

---
*Decisions last updated: 2025-08-22*
*Review scheduled: Before backend integration planning*
