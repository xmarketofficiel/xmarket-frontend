/**
 * SearchBar Component Tests
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import SearchBar from '../../components/SearchBar';

// Mock the API
const mockSearchSuggestions = jest.fn();
jest.mock('../../lib/apiEndpoints', () => ({
  getSearchSuggestions: mockSearchSuggestions,
}));

// Mock router
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe('SearchBar', () => {
  beforeEach(() => {
    mockSearchSuggestions.mockClear();
    mockPush.mockClear();
    mockSearchSuggestions.mockResolvedValue({
      success: true,
      data: {
        suggestions: [
          { text: 'iPhone 14', type: 'item', count: 15 },
          { text: 'MacBook Pro', type: 'item', count: 8 },
          { text: 'Electronics', type: 'category', count: 45 },
        ],
      },
    });
  });

  it('renders search input correctly', () => {
    render(<SearchBar />);
    
    expect(screen.getByPlaceholderText(/search for items/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
  });

  it('shows suggestions when typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone');
    
    await waitFor(() => {
      expect(mockSearchSuggestions).toHaveBeenCalledWith('iPhone');
    });
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 14')).toBeInTheDocument();
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
  });

  it('navigates to search results on form submit', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone 14');
    
    const form = searchInput.closest('form');
    fireEvent.submit(form!);
    
    expect(mockPush).toHaveBeenCalledWith('/?search=iPhone+14');
  });

  it('navigates to search results on Enter key', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'MacBook');
    await user.keyboard('{Enter}');
    
    expect(mockPush).toHaveBeenCalledWith('/?search=MacBook');
  });

  it('selects suggestion on click', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone');
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('iPhone 14'));
    
    expect(mockPush).toHaveBeenCalledWith('/?search=iPhone+14');
  });

  it('highlights matching text in suggestions', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'Mac');
    
    await waitFor(() => {
      const suggestion = screen.getByText('MacBook Pro');
      const highlightedPart = suggestion.querySelector('mark');
      expect(highlightedPart).toHaveTextContent('Mac');
    });
  });

  it('shows suggestion counts', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone');
    
    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument(); // iPhone 14 count
      expect(screen.getByText('45')).toBeInTheDocument(); // Electronics count
    });
  });

  it('differentiates between item and category suggestions', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone');
    
    await waitFor(() => {
      const categoryBadge = screen.getByText('Category');
      expect(categoryBadge).toBeInTheDocument();
    });
  });

  it('clears suggestions when input is empty', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone');
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    });
    
    await user.clear(searchInput);
    
    await waitFor(() => {
      expect(screen.queryByText('iPhone 14')).not.toBeInTheDocument();
    });
  });

  it('handles keyboard navigation through suggestions', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone');
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    });
    
    // Navigate down with arrow key
    await user.keyboard('{ArrowDown}');
    
    // First suggestion should be highlighted
    const firstSuggestion = screen.getByText('iPhone 14').closest('button');
    expect(firstSuggestion).toHaveClass('bg-gray-100');
    
    // Navigate down again
    await user.keyboard('{ArrowDown}');
    
    // Second suggestion should be highlighted
    const secondSuggestion = screen.getByText('MacBook Pro').closest('button');
    expect(secondSuggestion).toHaveClass('bg-gray-100');
  });

  it('selects highlighted suggestion on Enter', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone');
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    });
    
    // Navigate to first suggestion and select with Enter
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    
    expect(mockPush).toHaveBeenCalledWith('/?search=iPhone+14');
  });

  it('closes suggestions on Escape', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone');
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    });
    
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText('iPhone 14')).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    mockSearchSuggestions.mockRejectedValueOnce(new Error('Network error'));
    
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, 'iPhone');
    
    // Should not show error UI, just no suggestions
    await waitFor(() => {
      expect(screen.queryByText('iPhone 14')).not.toBeInTheDocument();
    });
  });

  it('debounces search requests', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    
    // Type quickly
    await user.type(searchInput, 'i');
    await user.type(searchInput, 'Ph');
    await user.type(searchInput, 'one');
    
    // Should only make one API call after debounce
    await waitFor(() => {
      expect(mockSearchSuggestions).toHaveBeenCalledTimes(1);
      expect(mockSearchSuggestions).toHaveBeenCalledWith('iPhone');
    });
  });
});
