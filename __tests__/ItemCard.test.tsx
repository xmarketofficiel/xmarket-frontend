import React from 'react';
import { render, screen } from '@testing-library/react';
import ItemCard from '../components/ItemCard';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { UserProvider } from '../contexts/UserContext';
import { User, Item } from '../types';

const mockUser: User = {
  id: 'u1',
  name: 'Test User',
  program: 'Informatique',
  year: 'L3',
  verified: true,
};

const mockItem: Item = {
  id: 'i1',
  title: 'Test Item',
  description: 'A test item',
  price: 100,
  category: { id: 'c1', name: 'Books', icon: 'book' },
  photos: ['/images/placeholder.png'],
  sellerId: 'u1',
  seller: mockUser,
  createdAt: new Date().toISOString(),
};

describe('ItemCard', () => {
  it('renders title and price', () => {
    render(
      <UserProvider>
        <FavoritesProvider>
          <ItemCard item={mockItem} />
        </FavoritesProvider>
      </UserProvider>
    );
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText(/100 DH/)).toBeInTheDocument();
  });
});
