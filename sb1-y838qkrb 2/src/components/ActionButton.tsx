import React from 'react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  icon,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
}) => {
  const baseClasses = "flex items-center justify-center gap-2 rounded-lg py-3 px-4 font-bold shadow-lg transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  
  const variantClasses = {
    primary: "bg-green-700 hover:bg-green-600 text-white focus:ring-green-600",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-600",
    danger: "bg-red-700 hover:bg-red-600 text-white focus:ring-red-600"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "transform active:scale-95";
  const widthClasses = fullWidth ? "w-full" : "";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${widthClasses} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;