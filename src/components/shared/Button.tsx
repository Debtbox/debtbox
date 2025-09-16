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
}

const Button = ({
  text,
  onClick,
  className,
  type,
  disabled,
  icon,
  isLoading = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        className,
        isLoading &&
          'disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
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
