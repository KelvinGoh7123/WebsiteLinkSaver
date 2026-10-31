interface LogoProps {
  className?: string;
}

const Logo = ({ className = "h-6 w-6" }: LogoProps) => {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M8.2 4.8h10.4L26.4 12.4v14.2a2.2 2.2 0 0 1-2.2 2.2H8.2A2.2 2.2 0 0 1 6 26.6V7a2.2 2.2 0 0 1 2.2-2.2zm10.2.6 7.2 7h-5.6a1.6 1.6 0 0 1-1.6-1.6V5.4z"
      />
    </svg>
  );
};

export default Logo;
