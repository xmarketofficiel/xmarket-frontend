/**
 * ItemCard Component Tests
 */

import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, mockItem } from '../test-utils';
import ItemCard from '../../components/ItemCard';
import { Item } from '../../types';

// Mock next/router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the FavoritesContext
const mockToggleFavorite = jest.fn();
const mockIsFavorite = jest.fn();

jest.mock('../../contexts/FavoritesContext', () => ({
  useFavorites: () => ({
    toggleFavorite: mockToggleFavorite,
    isFavorite: mockIsFavorite,
  }),
}));

// Use the mockItem from test-utils instead of defining a local one

describe('ItemCard', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockToggleFavorite.mockClear();
    mockIsFavorite.mockClear();
  });

  it('renders item information correctly', () => {
    mockIsFavorite.mockReturnValue(false);
    render(<ItemCard item={mockItem} />);
    
    expect(screen.getByText('MacBook Pro 2023')).toBeInTheDocument();
    expect(screen.getByText('EGP 25,000')).toBeInTheDocument();
    expect(screen.getByText('Cairo, Egypt')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument(); // likes count
    expect(screen.getByText('120')).toBeInTheDocument(); // views count
  });

  it('shows favorite button with correct state', () => {
    mockIsFavorite.mockReturnValue(true);
    render(<ItemCard item={mockItem} />);
    
    const favoriteButton = screen.getByLabelText(/remove from favorites/i);
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveClass('text-red-500');
  });

  it('toggles favorite when favorite button is clicked', async () => {
    const user = userEvent.setup();
    mockIsFavorite.mockReturnValue(false);
    render(<ItemCard item={mockItem} />);
    
    const favoriteButton = screen.getByLabelText(/add to favorites/i);
    await user.click(favoriteButton);
    
    expect(mockToggleFavorite).toHaveBeenCalledWith('1');
  });

  it('navigates to item detail when card is clicked', async () => {
    const user = userEvent.setup();
    mockIsFavorite.mockReturnValue(false);
    render(<ItemCard item={mockItem} />);
    
    const card = screen.getByRole('article');
    await user.click(card);
    
    expect(mockPush).toHaveBeenCalledWith('/item/1');
  });

  it('does not navigate when favorite button is clicked', async () => {
    const user = userEvent.setup();
    mockIsFavorite.mockReturnValue(false);
    render(<ItemCard item={mockItem} />);
    
    const favoriteButton = screen.getByLabelText(/add to favorites/i);
    await user.click(favoriteButton);
    
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows correct time formatting', () => {
    mockIsFavorite.mockReturnValue(false);
    const recentItem = {
      ...mockItem,
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    };
    
    render(<ItemCard item={recentItem} />);
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

  it('renders image with proper alt text', () => {
    mockIsFavorite.mockReturnValue(false);
    render(<ItemCard item={mockItem} />);
    
    const image = screen.getByAltText('MacBook Pro 2023');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image1.jpg');
  });

  it('shows seller avatar and name', () => {
    mockIsFavorite.mockReturnValue(false);
    render(<ItemCard item={mockItem} />);
    
    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    mockIsFavorite.mockReturnValue(false);
    render(<ItemCard item={mockItem} />);
    
    const card = screen.getByRole('article');
    
    // Focus the card
    card.focus();
    
    // Press Enter
    await user.keyboard('{Enter}');
    
    expect(mockPush).toHaveBeenCalledWith('/item/1');
  });

  it('shows category badge', () => {
    mockIsFavorite.mockReturnValue(false);
    render(<ItemCard item={mockItem} />);
    
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('formats large numbers correctly', () => {
    mockIsFavorite.mockReturnValue(false);
    const expensiveItem = {
      ...mockItem,
      price: 1500000, // 1.5M
      views: 1234,
      likes: 999,
    };
    
    render(<ItemCard item={expensiveItem} />);
    
    expect(screen.getByText('EGP 1,500,000')).toBeInTheDocument();
    expect(screen.getByText('1.2K')).toBeInTheDocument(); // views
    expect(screen.getByText('999')).toBeInTheDocument(); // likes
  });
});
