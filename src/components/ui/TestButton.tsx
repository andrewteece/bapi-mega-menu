import { cn } from '@/lib/utils';

type Props = {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
};

export default function TestButton({
  variant = 'primary',
  size = 'md',
  children,
}: Props) {
  return (
    <button
      className={cn(
        'rounded font-semibold transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' &&
          'bg-gray-200 text-gray-900 hover:bg-gray-300',
        size === 'sm' && 'px-2 py-1 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-6 py-3 text-lg'
      )}
    >
      {children}
    </button>
  );
}
