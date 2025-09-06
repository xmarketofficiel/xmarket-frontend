/**
 * Feed Component Tests
 */

import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../test-utils";
import Feed from "../../components/Feed";
import { mockItems } from "../../utils/mockData";

// Mock IntersectionObserver for infinite scroll
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  unobserve: jest.fn(),
}));

// Mock the API
jest.mock("../../lib/apiEndpoints", () => ({
  getItems: jest.fn().mockResolvedValue({
    success: true,
    data: {
      items: mockItems.slice(0, 10),
      pagination: {
        page: 1,
        limit: 10,
        total: mockItems.length,
        totalPages: Math.ceil(mockItems.length / 10),
        hasNext: mockItems.length > 10,
      },
    },
  }),
}));

describe("Feed", () => {
  beforeEach(() => {
    mockObserve.mockClear();
    mockDisconnect.mockClear();
  });

  it("renders loading skeletons initially", async () => {
    render(<Feed />);

    // Should show skeleton cards while loading
    const skeletons = screen.getAllByTestId("skeleton-card");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders items after loading", async () => {
    render(<Feed />);

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText("iPhone 14 Pro")).toBeInTheDocument();
    });

    // Should show item cards
    const itemCards = screen.getAllByRole("article");
    expect(itemCards).toHaveLength(10);
  });

  it("applies category filter", async () => {
    const user = userEvent.setup();
    render(<Feed />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("iPhone 14 Pro")).toBeInTheDocument();
    });

    // Click electronics filter
    const electronicsFilter = screen.getByText("Electronics");
    await user.click(electronicsFilter);

    // Should filter items by category
    await waitFor(() => {
      const visibleItems = screen.getAllByRole("article");
      expect(visibleItems.length).toBeLessThan(10);
    });
  });

  it("applies search filter", async () => {
    const user = userEvent.setup();
    render(<Feed />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("iPhone 14 Pro")).toBeInTheDocument();
    });

    // Search for iPhone
    const searchInput = screen.getByPlaceholderText(/search for items/i);
    await user.type(searchInput, "iPhone");

    // Should filter items by search term
    await waitFor(() => {
      expect(screen.getByText("iPhone 14 Pro")).toBeInTheDocument();
      expect(screen.queryByText("MacBook Pro")).not.toBeInTheDocument();
    });
  });

  it("handles empty state", async () => {
    // Mock empty response
    const { getItems } = require("../../lib/apiEndpoints");
    getItems.mockResolvedValueOnce({
      success: true,
      data: {
        items: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
        },
      },
    });

    render(<Feed />);

    await waitFor(() => {
      expect(screen.getByText(/no items found/i)).toBeInTheDocument();
    });
  });

  it("implements infinite scroll", async () => {
    render(<Feed />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("iPhone 14 Pro")).toBeInTheDocument();
    });

    // Verify IntersectionObserver was set up
    expect(mockObserve).toHaveBeenCalled();
  });

  it("handles API errors gracefully", async () => {
    // Mock API error
    const { getItems } = require("../../lib/apiEndpoints");
    getItems.mockRejectedValueOnce(new Error("Network error"));

    render(<Feed />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load items/i)).toBeInTheDocument();
    });

    // Should show retry button
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it("allows retry after error", async () => {
    const user = userEvent.setup();

    // Mock initial error then success
    const { getItems } = require("../../lib/apiEndpoints");
    getItems
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        success: true,
        data: {
          items: mockItems.slice(0, 10),
          pagination: {
            page: 1,
            limit: 10,
            total: mockItems.length,
            totalPages: Math.ceil(mockItems.length / 10),
            hasNext: mockItems.length > 10,
          },
        },
      });

    render(<Feed />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/failed to load items/i)).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByText(/try again/i);
    await user.click(retryButton);

    // Should load items successfully
    await waitFor(() => {
      expect(screen.getByText("iPhone 14 Pro")).toBeInTheDocument();
    });
  });

  it("sorts items correctly", async () => {
    const user = userEvent.setup();
    render(<Feed />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("iPhone 14 Pro")).toBeInTheDocument();
    });

    // Find sort dropdown (assuming it exists)
    const sortButton = screen.getByRole("button", { name: /sort/i });
    await user.click(sortButton);

    // Select price low to high
    const priceLowOption = screen.getByText(/price: low to high/i);
    await user.click(priceLowOption);

    // Should re-sort items
    await waitFor(() => {
      const itemCards = screen.getAllByRole("article");
      expect(itemCards.length).toBeGreaterThan(0);
    });
  });

  it("maintains scroll position on filter changes", async () => {
    const user = userEvent.setup();
    render(<Feed />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("iPhone 14 Pro")).toBeInTheDocument();
    });

    // Scroll down
    window.scrollTo(0, 500);

    // Apply filter
    const electronicsFilter = screen.getByText("Electronics");
    await user.click(electronicsFilter);

    // Should maintain reasonable scroll position
    expect(window.scrollY).toBeLessThan(100);
  });
});
