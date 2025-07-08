type ButtonProps = {
    icon?: React.ReactNode;
    label?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'link';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    className?: string;
    iconOnly?: boolean;
}
export default function Button({ icon, label, onClick, variant = 'primary', size = 'medium', disabled = false, className = '' }: ButtonProps) {
  const baseClass = 'rounded-md font-medium transition-colors';
  const variantClass = {
    primary: 'bg-blue-500 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    tertiary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
    link: 'bg-transparent hover:bg-gray-100 text-gray-800',
  }
  const sizeClass = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  }
  const disabledClass = 'opacity-50 cursor-not-allowed';
  const finalClass = `${baseClass} ${variantClass[variant]} ${sizeClass[size]} ${disabled ? disabledClass : ''} ${className}`;
  return (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`${finalClass}`}>
      {icon ?? label}
    </button>
  );
}