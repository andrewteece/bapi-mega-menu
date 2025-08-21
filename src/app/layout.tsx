import './globals.css';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Container from '@/components/layout/Container';
import Providers from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='flex flex-col min-h-screen bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100'>
        <Providers>
          {/* Global Header */}
          <SiteHeader />

          {/* Main Content */}
          <main className='flex-1'>
            <Container className='py-8'>{children}</Container>
          </main>

          {/* Global Footer */}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
