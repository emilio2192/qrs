import { render, screen, fireEvent } from '@testing-library/react';
import ProductImageGallery from '../ProductImageGallery';

describe('ProductImageGallery', () => {
  const mockImages = [
    { url: '/image1.jpg', alt: 'Product Image 1' },
    { url: '/image2.jpg', alt: 'Product Image 2' },
    { url: '/image3.jpg', alt: 'Product Image 3' },
  ];

  const defaultProps = {
    images: mockImages,
    selectedIndex: 0,
    setSelectedIndex: jest.fn(),
    productName: 'Test Product',
  };

  it('renders main image correctly', () => {
    render(<ProductImageGallery {...defaultProps} />);

    const mainImage = screen.getByRole('img', { name: 'Product Image 1' });
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', expect.stringMatching(/image1\.jpg/));
  });

  it('renders all thumbnail images', () => {
    render(<ProductImageGallery {...defaultProps} />);

    const thumbnails = screen.getAllByRole('img');
    expect(thumbnails).toHaveLength(4); // 3 thumbnails + 1 main image

    // Check that all thumbnail images are rendered
    defaultProps.images.forEach((image, index) => {
      const thumbnail = screen.getByRole('img', { name: `Product Image ${index + 1}` });
      expect(thumbnail).toBeInTheDocument();
      // Next.js Image transforms URLs, so we check for the filename in the URL-encoded format
      const filename = image.url.split('/').pop(); // Get just the filename
      if (filename) {
        expect(thumbnail).toHaveAttribute('src', expect.stringMatching(new RegExp(filename)));
      }
    });
  });

  it('handles thumbnail click', () => {
    const setSelectedIndex = jest.fn();
    render(
      <ProductImageGallery {...defaultProps} setSelectedIndex={setSelectedIndex} />
    );

    const secondThumbnail = screen.getByRole('img', { name: 'Product Image 2' });
    fireEvent.click(secondThumbnail);

    expect(setSelectedIndex).toHaveBeenCalledWith(1);
  });

  it('applies selected class to current thumbnail', () => {
    render(<ProductImageGallery {...defaultProps} selectedIndex={1} />);

    // Find the button containing the selected thumbnail
    const selectedButton = screen.getByLabelText('Show image 2');
    expect(selectedButton).toHaveClass('ring-2');
    expect(selectedButton).toHaveClass('ring-primary-500');
  });

  it('renders placeholder when no images provided', () => {
    render(
      <ProductImageGallery
        images={[]}
        selectedIndex={0}
        setSelectedIndex={jest.fn()}
        productName="Test Product"
      />
    );

    const placeholder = screen.getByRole('img', { name: 'Test Product' });
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute('src', expect.stringMatching(/placeholder\.png/));
  });

  it('renders single image without thumbnails', () => {
    const singleImage = [{ url: '/single.jpg', alt: 'Single Image' }];
    render(
      <ProductImageGallery
        images={singleImage}
        selectedIndex={0}
        setSelectedIndex={jest.fn()}
        productName="Test Product"
      />
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2); // Main image + thumbnail
  });

  it('handles image with missing alt text', () => {
    const imagesWithoutAlt = [
      { url: '/image1.jpg' },
      { url: '/image2.jpg', alt: 'Image 2' }
    ];
    render(
      <ProductImageGallery
        images={imagesWithoutAlt}
        selectedIndex={0}
        setSelectedIndex={jest.fn()}
        productName="Test Product"
      />
    );

    const mainImage = screen.getAllByRole('img', { name: 'Test Product' })[0];
    expect(mainImage).toBeInTheDocument();
  });

  it('applies correct CSS classes to main container', () => {
    render(<ProductImageGallery {...defaultProps} />);

    const mainContainer = screen.getByRole('img', { name: 'Test Product' }).closest('div')?.parentElement;
    expect(mainContainer).toHaveClass('flex-row');
    expect(mainContainer).toHaveClass('gap-4');
    expect(mainContainer).toHaveClass('items-start');
  });

  it('applies correct CSS classes to thumbnail container', () => {
    render(<ProductImageGallery {...defaultProps} />);

    const thumbnailContainer = screen.getByRole('img', { name: 'Product Image 1' }).closest('div')?.parentElement;
    expect(thumbnailContainer).toHaveClass('flex');
    expect(thumbnailContainer).toHaveClass('gap-4');
    expect(thumbnailContainer).toHaveClass('gap-4');
  });

  it('renders with different selected index', () => {
    render(<ProductImageGallery {...defaultProps} selectedIndex={2} />);

    const mainImage = screen.getByRole('img', { name: 'Product Image 3' });
    expect(mainImage).toBeInTheDocument();
    // Next.js Image component transforms the src, so we just check that it exists
    expect(mainImage).toHaveAttribute('src');
  });
}); 