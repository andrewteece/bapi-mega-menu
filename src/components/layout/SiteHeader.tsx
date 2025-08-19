import Link from 'next/link';
import BapiMegaMenu from '@/components/navigation/BapiMegaMenu';
import Container from '@/components/layout/Container';

export default function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 border-b bg-white/70 backdrop-blur overflow-x-clip'>
      <Container className='flex items-center justify-between gap-3 py-3'>
        <Link href='/' className='font-bold tracking-wide'>
          BAPI Mock
        </Link>
        <BapiMegaMenu />
      </Container>
    </header>
  );
}
