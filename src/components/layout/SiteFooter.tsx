import Container from '@/components/layout/Container';

export default function SiteFooter() {
  return (
    <footer className='py-8 mt-12 text-sm border-t text-neutral-500'>
      <Container className='space-y-2 text-center'>
        <p>© {new Date().getFullYear()} BAPI Mock – Demo Project</p>
        <p className='text-xs'>
          Built with Next.js & Tailwind CSS for interview demonstration
        </p>
      </Container>
    </footer>
  );
}
