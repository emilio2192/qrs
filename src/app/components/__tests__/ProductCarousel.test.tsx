import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ProductCarousel from '../ProductCarousel';
import { productFactory } from '../../../test/factories/productFactory';
import * as requestModule from '../../../lib/request';

// Mock the request module
jest.mock('../../../lib/request');
const mockFetchProducts = requestModule.fetchProducts as jest.MockedFunction<typeof requestModule.fetchProducts>;

describe('ProductCarousel', () => {
  const mockProducts = productFactory.buildList(3);

  // Mock scrollTo for JSDOM
  beforeAll(() => {
    Object.defineProperty(window.HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: jest.fn(),
    });
  });

  beforeEach(() => {
    mockFetchProducts.mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    act(() => {
      render(<ProductCarousel />);
    });
    // Check for the spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders products after loading', async () => {
    act(() => {
      render(<ProductCarousel />);
    });
    await waitFor(() => {
      expect(screen.getAllByText(mockProducts[0].name)).toHaveLength(1);
    });
    expect(mockFetchProducts).toHaveBeenCalledWith({ sort: 'newest' });
  });

  it('renders error state when API call fails', async () => {
    mockFetchProducts.mockRejectedValue(new Error('API Error'));
    act(() => {
      render(<ProductCarousel />);
    });
    await waitFor(() => {
      expect(screen.getByText('common.error')).toBeInTheDocument();
    });
  });

  it('renders no products message when empty array is returned', async () => {
    mockFetchProducts.mockResolvedValue([]);
    act(() => {
      render(<ProductCarousel />);
    });
    await waitFor(() => {
      expect(screen.getByText('common.noProducts')).toBeInTheDocument();
    });
  });

  it('renders navigation buttons', async () => {
    act(() => {
      render(<ProductCarousel />);
    });
    await waitFor(() => {
      expect(screen.getByLabelText('Scroll left')).toBeInTheDocument();
      expect(screen.getByLabelText('Scroll right')).toBeInTheDocument();
    });
  });

  it('handles scroll left button click', async () => {
    act(() => {
      render(<ProductCarousel />);
    });
    await waitFor(() => {
      expect(screen.getAllByText(mockProducts[0].name)).toHaveLength(1);
    });
    const leftButton = screen.getByLabelText('Scroll left');
    fireEvent.click(leftButton);
    expect(leftButton).toBeInTheDocument();
  });

  it('handles scroll right button click', async () => {
    act(() => {
      render(<ProductCarousel />);
    });
    await waitFor(() => {
      expect(screen.getAllByText(mockProducts[0].name)).toHaveLength(1);
    });
    const rightButton = screen.getByLabelText('Scroll right');
    fireEvent.click(rightButton);
    expect(rightButton).toBeInTheDocument();
  });

  it('fetches products with custom API URL', async () => {
    const customApiUrl = '/api/products?sort=newest&limit=10';
    act(() => {
      render(<ProductCarousel apiUrl={customApiUrl} />);
    });
    await waitFor(() => {
      expect(mockFetchProducts).toHaveBeenCalledWith({ sort: 'newest', limit: '10' });
    });
  });

  it('handles API URL without query parameters', async () => {
    act(() => {
      render(<ProductCarousel apiUrl="/api/products" />);
    });
    await waitFor(() => {
      expect(mockFetchProducts).toHaveBeenCalledWith({});
    });
  });

  it('renders multiple product cards', async () => {
    act(() => {
      render(<ProductCarousel />);
    });
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(mockProducts.length);
    });
  });

  it('applies correct CSS classes to scroll container', async () => {
    act(() => {
      render(<ProductCarousel />);
    });
    await waitFor(() => {
      const scrollContainer = screen.getByTestId('carousel-scroll');
      expect(scrollContainer).toHaveClass('flex');
      expect(scrollContainer).toHaveClass('gap-4');
      expect(scrollContainer).toHaveClass('overflow-x-auto');
    });
  });
}); 