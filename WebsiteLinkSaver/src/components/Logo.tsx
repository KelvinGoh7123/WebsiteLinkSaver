interface LogoProps {
  className?: string;
}

const Logo = ({ className = "h-7 w-7" }: LogoProps) => {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M3.5 3.5h8.7L19 10.3V18H28.5v10.5h-25V3.5z" />
      <path d="M14.6 3.5H19l.1 4.6-4.5-4.6z" />
    </svg>
  );
};

export default Logo;
