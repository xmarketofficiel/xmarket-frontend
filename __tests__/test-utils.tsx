import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { UserProvider } from '../contexts/UserContext';
import { ToastProvider } from '../contexts/ToastContext';
import { UIProvider } from '../contexts/UIContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

// Mock providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <UIProvider>
      <ToastProvider>
        <UserProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </UserProvider>
      </ToastProvider>
    </UIProvider>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock data utilities
export const mockItem = {
  id: '1',
  title: 'Test Item',
  description: 'A test item description that is long enough to meet requirements',
  price: 25,
  category: {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱'
  },
  photos: ['https://example.com/photo1.jpg'],
  sellerId: '1',
  seller: {
    id: '1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    program: 'Computer Science',
    year: '3',
    verified: true
  },
  createdAt: '2024-01-01T00:00:00Z',
  featured: false
};

export const mockUser = {
  id: '1',
  name: 'John Doe',
  avatar: 'https://example.com/avatar.jpg',
  program: 'Computer Science',
  year: '3',
  verified: true
};