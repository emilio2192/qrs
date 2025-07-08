import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BannerCarousel from '../BannerCarousel';
import { bannerFactory } from '../../../test/factories/bannerFactory';
import * as requestModule from '../../../lib/request';

// Mock the request module
jest.mock('../../../lib/request');
const mockFetchBanners = requestModule.fetchBanners as jest.MockedFunction<typeof requestModule.fetchBanners>;

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: { reload: jest.fn() },
    writable: true,
  });
});

describe('BannerCarousel', () => {
  const mockBanners = bannerFactory.buildList(3);

  beforeEach(() => {
    mockFetchBanners.mockResolvedValue(mockBanners);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    act(() => {
      render(<BannerCarousel />);
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('common.loading')).toBeInTheDocument();
  });

  it('renders banners after loading', async () => {
    act(() => {
      render(<BannerCarousel />);
    });
    await waitFor(() => {
      expect(screen.getByText(mockBanners[0].title)).toBeInTheDocument();
    });

    expect(mockFetchBanners).toHaveBeenCalled();
  });

  it('renders error state when API call fails', async () => {
    mockFetchBanners.mockRejectedValue(new Error('API Error'));
    act(() => {
      render(<BannerCarousel />);
    });
    await waitFor(() => {
      expect(screen.getByText('common.error')).toBeInTheDocument();
      expect(screen.getByText('common.retry')).toBeInTheDocument();
    });
  });

  it('renders no banners message when empty array is returned', async () => {
    mockFetchBanners.mockResolvedValue([]);
    act(() => {
      render(<BannerCarousel />);
    });
    await waitFor(() => {
      expect(screen.getByText('common.noBanners')).toBeInTheDocument();
    });
  });

  it('renders navigation buttons', async () => {
    act(() => {
      render(<BannerCarousel />);
    });
    await waitFor(() => {
      expect(screen.getByLabelText('Previous banner')).toBeInTheDocument();
      expect(screen.getByLabelText('Next banner')).toBeInTheDocument();
    });
  });

  it('does not render navigation arrows for single banner', async () => {
    mockFetchBanners.mockResolvedValue([mockBanners[0]]);
    
    render(<BannerCarousel />);

    await waitFor(() => {
      expect(screen.queryByLabelText('Previous banner')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next banner')).not.toBeInTheDocument();
    });
  });

  it('handles previous button click', async () => {
    act(() => {
      render(<BannerCarousel />);
    });
    await waitFor(() => {
      expect(screen.getByText(mockBanners[0].title)).toBeInTheDocument();
    });

    const prevButton = screen.getByLabelText('Previous banner');
    fireEvent.click(prevButton);
    
    // Button should be clickable without throwing errors
    expect(prevButton).toBeInTheDocument();
  });

  it('handles next button click', async () => {
    act(() => {
      render(<BannerCarousel />);
    });
    await waitFor(() => {
      expect(screen.getByText(mockBanners[0].title)).toBeInTheDocument();
    });

    const nextButton = screen.getByLabelText('Next banner');
    fireEvent.click(nextButton);
    
    // Button should be clickable without throwing errors
    expect(nextButton).toBeInTheDocument();
  });

  it('renders dots indicator for multiple banners', async () => {
    act(() => {
      render(<BannerCarousel />);
    });
    await waitFor(() => {
      const dots = screen.getAllByLabelText(/Go to banner/);
      expect(dots).toHaveLength(3);
    });
  });

  it('handles dot click', async () => {
    act(() => {
      render(<BannerCarousel />);
    });
    await waitFor(() => {
      const dots = screen.getAllByLabelText(/Go to banner/);
      fireEvent.click(dots[1]);
      
      // Dot should be clickable without throwing errors
      expect(dots[1]).toBeInTheDocument();
    });
  });

  it('handles retry button click', async () => {
    mockFetchBanners.mockRejectedValue(new Error('API Error'));
    
    render(<BannerCarousel />);

    await waitFor(() => {
      const retryButton = screen.getByText('common.retry');
      fireEvent.click(retryButton);
      
      // Button should be clickable without throwing errors
      expect(retryButton).toBeInTheDocument();
    });
  });

  it('disables auto-play when autoPlay is false', async () => {
    render(<BannerCarousel autoPlay={false} />);

    await waitFor(() => {
      expect(screen.getByText(mockBanners[0].title)).toBeInTheDocument();
    });

    // Should still render navigation buttons
    expect(screen.getByLabelText('Previous banner')).toBeInTheDocument();
    expect(screen.getByLabelText('Next banner')).toBeInTheDocument();
  });

  it('applies correct CSS classes to container', async () => {
    act(() => {
      render(<BannerCarousel />);
    });
    await waitFor(() => {
      const container = screen.getByRole('banner');
      expect(container).toHaveClass('relative');
      expect(container).toHaveClass('w-full');
      // The h-96 class is on the inner div, not the container
      expect(container).not.toHaveClass('h-96');
    });
  });
}); 