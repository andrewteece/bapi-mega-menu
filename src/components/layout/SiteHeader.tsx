import BapiMegaMenu from '@/components/navigation/bapi-mega-menu';

export default function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 border-b bg-background/70 backdrop-blur'>
      <div className='flex items-center justify-between max-w-6xl gap-3 px-4 py-3 mx-auto'>
        <a href='/' className='font-bold tracking-wide'>
          BAPI Mock
        </a>
        <BapiMegaMenu />
      </div>
    </header>
  );
}
