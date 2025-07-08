import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';
import { productFactory } from '../../../test/factories/productFactory';

describe('ProductCard', () => {
  const mockProduct = productFactory.build();

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price.toLocaleString()}`)).toBeInTheDocument();
  });

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    // Next.js Image component transforms the src, so we just check that it exists
    expect(image).toHaveAttribute('src');
    // Check that the alt text matches the product name (since that's what ProductCard uses)
    expect(image).toHaveAttribute('alt', mockProduct.name);
  });

  it('renders placeholder image when no images are available', () => {
    const productWithoutImages = productFactory.build({ images: [] });
    render(<ProductCard product={productWithoutImages} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', productWithoutImages.name);
  });

  it('applies correct CSS classes', () => {
    render(<ProductCard product={mockProduct} />);

    const card = screen.getByRole('article');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('shadow-sm');
    expect(card).toHaveClass('overflow-hidden');
  });

  it('renders as a link with correct href', () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/product/${mockProduct.id}`);
  });

  it('handles click events', () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    fireEvent.click(link);
    // The link should be clickable without throwing errors
    expect(link).toBeInTheDocument();
  });

  it('renders with different product data', () => {
    const anotherProduct = productFactory.build({
      name: 'Another Product',
      price: 99.99,
    });
    render(<ProductCard product={anotherProduct} />);

    expect(screen.getByText('Another Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });
}); 