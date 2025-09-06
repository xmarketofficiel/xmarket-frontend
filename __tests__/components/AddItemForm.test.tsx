/**
 * AddItemForm Component Tests
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import AddItemForm from '../../components/AddItemForm';

// Mock the ToastContext
const mockAddToast = jest.fn();
jest.mock('../../contexts/ToastContext', () => ({
  useToast: () => ({
    addToast: mockAddToast,
  }),
}));

describe('AddItemForm', () => {
  beforeEach(() => {
    mockAddToast.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<AddItemForm />);
    
    expect(screen.getByLabelText(/photos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('shows step indicator', () => {
    render(<AddItemForm />);
    
    const stepIndicators = screen.getAllByRole('progressbar');
    expect(stepIndicators).toHaveLength(1);
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<AddItemForm />);
    
    // Try to go to next step without photos
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    expect(screen.getByText(/at least one photo is required/i)).toBeInTheDocument();
  });

  it('allows photo upload', async () => {
    const user = userEvent.setup();
    render(<AddItemForm />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload photos/i);
    
    await user.upload(input, file);
    
    // Should show photo preview
    await waitFor(() => {
      expect(screen.getByAltText(/uploaded photo 1/i)).toBeInTheDocument();
    });
  });

  it('validates form data with Zod schema', async () => {
    const user = userEvent.setup();
    render(<AddItemForm />);
    
    // Add a photo first
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload photos/i);
    await user.upload(input, file);
    
    // Go to next step
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    // Try to submit without required fields
    const submitButton = screen.getByText('Post Item');
    await user.click(submitButton);
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/title must be at least 5 characters/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup();
    render(<AddItemForm />);
    
    // Add photo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload photos/i);
    await user.upload(input, file);
    
    // Go to next step
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    // Fill form
    await user.type(screen.getByLabelText(/title/i), 'Test MacBook Pro');
    await user.type(screen.getByLabelText(/description/i), 'A great laptop in excellent condition for university work');
    await user.type(screen.getByLabelText(/price/i), '15000');
    
    // Submit
    const submitButton = screen.getByText('Post Item');
    await user.click(submitButton);
    
    // Should show success toast
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('Item posted successfully!', 'success');
    });
  });

  it('handles drag and drop file upload', async () => {
    render(<AddItemForm />);
    
    const dropZone = screen.getByText(/drag and drop photos/i).closest('div');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    // Simulate drag enter
    fireEvent.dragEnter(dropZone!, {
      dataTransfer: {
        items: [file],
        files: [file],
      },
    });
    
    expect(screen.getByText(/drop your photos here/i)).toBeInTheDocument();
    
    // Simulate drop
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
        items: [file],
      },
    });
    
    // Should show photo preview
    await waitFor(() => {
      expect(screen.getByAltText(/uploaded photo 1/i)).toBeInTheDocument();
    });
  });

  it('removes photos when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddItemForm />);
    
    // Add photo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload photos/i);
    await user.upload(input, file);
    
    // Wait for photo to appear
    await waitFor(() => {
      expect(screen.getByAltText(/uploaded photo 1/i)).toBeInTheDocument();
    });
    
    // Remove photo
    const removeButton = screen.getByLabelText(/remove photo 1/i);
    await user.click(removeButton);
    
    // Photo should be removed
    expect(screen.queryByAltText(/uploaded photo 1/i)).not.toBeInTheDocument();
  });

  it('shows character count and limits for inputs', async () => {
    const user = userEvent.setup();
    render(<AddItemForm />);
    
    // Add photo and go to next step
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload photos/i);
    await user.upload(input, file);
    
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    // Check help text for character limits
    expect(screen.getByText(/5-100 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/20-1000 characters/i)).toBeInTheDocument();
  });
});
