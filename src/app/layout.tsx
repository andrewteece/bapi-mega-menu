import './globals.css';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Container from '@/components/layout/Container';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen bg-white text-neutral-900'>
        {/* Global Header */}
        <SiteHeader />

        {/* Main Content */}
        <main className='flex-1'>
          <Container className='py-8'>{children}</Container>
        </main>

        {/* Global Footer */}
        <SiteFooter />
      </body>
    </html>
  );
}
