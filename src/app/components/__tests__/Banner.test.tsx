import { render, screen } from '@testing-library/react';
import Banner from '../Banner';
import { bannerFactory } from '../../../test/factories/bannerFactory';

describe('Banner', () => {
  const mockBanner = bannerFactory.build();

  it('renders banner information correctly', () => {
    render(<Banner banner={mockBanner} />);

    expect(screen.getByText(mockBanner.title)).toBeInTheDocument();
    expect(screen.getByText(mockBanner.subtitle!)).toBeInTheDocument();
    expect(screen.getByText(mockBanner.description!)).toBeInTheDocument();
  });

  it('renders banner without optional fields', () => {
    const minimalBanner = bannerFactory.build({
      subtitle: undefined,
      description: undefined,
      buttonText: undefined,
      buttonLink: undefined,
    });
    
    render(<Banner banner={minimalBanner} />);

    expect(screen.getByText(minimalBanner.title)).toBeInTheDocument();
    expect(screen.queryByText('undefined')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<Banner banner={mockBanner} />);

    const container = screen.getByText(mockBanner.title).closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('relative');
    expect(container).toHaveClass('w-full');
    expect(container).toHaveClass('h-96');
    expect(container).toHaveClass('md:h-[500px]');
  });

  it('renders with different banner data', () => {
    const anotherBanner = bannerFactory.build({
      title: 'Another Banner',
      subtitle: 'Another Subtitle',
    });
    
    render(<Banner banner={anotherBanner} />);

    expect(screen.getByText('Another Banner')).toBeInTheDocument();
    expect(screen.getByText('Another Subtitle')).toBeInTheDocument();
  });

  it('renders background image with correct styling', () => {
    render(<Banner banner={mockBanner} />);

    const backgroundDiv = screen.getByText(mockBanner.title).closest('div')?.parentElement?.parentElement?.querySelector('.absolute');
    expect(backgroundDiv).toHaveClass('bg-cover');
    expect(backgroundDiv).toHaveClass('bg-center');
    expect(backgroundDiv).toHaveClass('bg-no-repeat');
  });

  it('renders overlay with correct styling', () => {
    render(<Banner banner={mockBanner} />);

    const overlayDiv = screen.getByText(mockBanner.title).closest('div')?.parentElement?.parentElement?.querySelector('.bg-black');
    expect(overlayDiv).toHaveClass('bg-opacity-30');
  });
}); 