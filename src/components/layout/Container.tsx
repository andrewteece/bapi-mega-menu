type Props = React.PropsWithChildren<{ className?: string }>;

export default function Container({ className = '', children }: Props) {
  // Change max-w-6xl once and it updates site-wide
  return (
    <div className={`mx-auto max-w-6xl px-4 ${className}`}>{children}</div>
  );
}
