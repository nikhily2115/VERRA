import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-primary text-sm font-medium mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`input-field ${
          error ? 'border-red-500 focus:border-red-500' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default Input;
