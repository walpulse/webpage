type IconProps = { className?: string };

export function IconTelegram({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21.8 4.3c.3-.1.6.1.6.4l-2.2 14.6c-.1.5-.6.7-1 .5l-5.1-3.6-2.7 2.6c-.3.3-.8.1-.9-.3l-.4-4.6 9.2-8.3c.2-.2 0-.5-.3-.4L6.8 12.6 2.4 11.2c-.5-.2-.5-.9.1-1.1L21.8 4.3z" />
    </svg>
  );
}

export function IconMail({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  );
}

export function IconX({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.2 3H21l-6.6 7.5L22 21h-5.6l-4.4-5.7L7 21H4.2l7-8L2 3h5.7l4 5.2L18.2 3zm-1 16.5h1.6L7 4.4H5.3l11.9 15.1z" />
    </svg>
  );
}
