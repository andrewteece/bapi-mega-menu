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
      <body>
        <SiteHeader />
        <main className='min-h-screen'>
          <Container className='py-8'>{children}</Container>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
