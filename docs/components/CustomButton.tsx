import React from 'react'

interface CustomButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  children, 
  variant = 'primary',
  onClick 
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors"
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default CustomButton
