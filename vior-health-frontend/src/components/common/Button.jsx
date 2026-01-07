import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  Icon, 
  onClick, 
  disabled = false,
  className,
  type = 'button',
  fullWidth = false
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300',
    success: 'bg-success-600 text-white hover:bg-success-700',
    danger: 'bg-danger-600 text-white hover:bg-danger-700',
    warning: 'bg-warning-500 text-white hover:bg-warning-600',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Determine which icon to render
  let iconElement = null;
  if (Icon) {
    // Icon is a component reference
    iconElement = <Icon className="w-4 h-4" />;
  } else if (icon) {
    // icon is a component reference
    const IconComponent = icon;
    iconElement = <IconComponent className="w-4 h-4" />;
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {iconElement}
      {children}
    </button>
  );
};

export default Button;
