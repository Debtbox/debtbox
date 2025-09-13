interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Button = ({
  text,
  onClick,
  className,
  type,
  disabled,
  icon,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type={type}
      disabled={disabled}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
