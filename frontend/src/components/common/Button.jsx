import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-full transition-ultra-smooth flex items-center justify-center focus-ring gpu-accelerated will-change-transform';

  const variantClasses = {
    primary: 'bg-gold hover:bg-opacity-90 text-background hover:scale-105 disabled:hover:scale-100 luxury-shadow-lg hover:luxury-shadow-xl animate-pulse-glow',
    secondary: 'bg-card hover:bg-opacity-80 text-primary border border-gold hover:border-opacity-80 hover:scale-[1.02]',
    danger: 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 luxury-shadow-lg',
    outline: 'bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-background hover:scale-105',
    ghost: 'bg-transparent text-gold hover:bg-gold hover:bg-opacity-10 hover:scale-[1.02]',
    gradient: 'bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-background hover:scale-105 luxury-shadow-lg gradient-border',
  };

  const sizeClasses = {
    xs: 'py-1.5 px-4 text-xs',
    sm: 'py-2 px-6 text-sm',
    md: 'py-3 px-8',
    lg: 'py-4 px-10 text-lg',
    xl: 'py-5 px-12 text-xl',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed transform-none'
    : 'cursor-pointer';

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <span className={`${iconPosition === 'left' ? 'mr-2' : 'ml-2'} transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </span>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        {iconPosition === 'left' && renderIcon()}
        <span className="transition-all duration-300">{children}</span>
        {iconPosition === 'right' && renderIcon()}
      </div>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={`group ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

// Specialized button variants
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const GradientButton = (props) => <Button variant="gradient" {...props} />;

export default Button;
