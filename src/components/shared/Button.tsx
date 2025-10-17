import clsx from 'clsx';
import ButtonLoaderIcon from '../icons/ButtonLoaderIcon';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'gray' | 'no-variant';
}

const Button = ({
  text,
  onClick,
  className,
  type,
  disabled,
  icon,
  isLoading = false,
  variant = 'no-variant',
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        className,
        'cursor-pointer active:scale-[0.99] transition-all duration-200',
        isLoading &&
          'disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
        variant === 'primary' &&
          'bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'secondary' &&
          'bg-white text-primary rounded-lg hover:bg-gray-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-primary disabled:border-gray-300 disabled:text-gray-500',
        variant === 'gray' &&
          'bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 disabled:border-gray-300 disabled:text-gray-500',
      )}
      type={type}
      disabled={disabled || isLoading}
    >
      {icon}
      {text}
      {isLoading && <ButtonLoaderIcon />}
    </button>
  );
};

export default Button;
