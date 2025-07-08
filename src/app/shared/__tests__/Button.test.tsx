import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  const defaultProps = {
    label: 'Test Button',
    onClick: jest.fn(),
  };

  it('renders button with label', () => {
    render(<Button {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });

  it('renders button with icon', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(<Button {...defaultProps} icon={icon} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    render(<Button {...defaultProps} disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button {...defaultProps} variant="primary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-500');

    rerender(<Button {...defaultProps} variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');

    rerender(<Button {...defaultProps} variant="tertiary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-100');

    rerender(<Button {...defaultProps} variant="ghost" />);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');

    rerender(<Button {...defaultProps} variant="link" />);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button {...defaultProps} size="small" />);
    expect(screen.getByRole('button')).toHaveClass('py-1', 'px-2', 'text-sm');

    rerender(<Button {...defaultProps} size="medium" />);
    expect(screen.getByRole('button')).toHaveClass('py-2', 'px-4', 'text-base');

    rerender(<Button {...defaultProps} size="large" />);
    expect(screen.getByRole('button')).toHaveClass('py-3', 'px-6', 'text-lg');
  });

  it('applies custom className', () => {
    render(<Button {...defaultProps} className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders without onClick handler', () => {
    render(<Button label="Test" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Should not throw error when clicked without onClick
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it('renders without label when icon is provided', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(<Button icon={icon} onClick={jest.fn()} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies default variant and size', () => {
    render(<Button {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-500'); // primary variant
    expect(button).toHaveClass('py-2', 'px-4', 'text-base'); // medium size
  });

  it('combines all props correctly', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(
      <Button
        label="Test"
        icon={icon}
        variant="secondary"
        size="large"
        disabled
        className="custom-class"
        onClick={jest.fn()}
      />
    );

    const button = screen.getByRole('button');
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(button).toHaveClass('bg-gray-200'); // secondary
    expect(button).toHaveClass('py-3', 'px-6', 'text-lg'); // large
    expect(button).toHaveClass('opacity-50'); // disabled
    expect(button).toHaveClass('cursor-not-allowed'); // disabled
    expect(button).toHaveClass('custom-class');
  });

  it('handles keyboard events', () => {
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ' });

    // Should handle keyboard events without throwing errors
    expect(button).toBeInTheDocument();
  });
}); 