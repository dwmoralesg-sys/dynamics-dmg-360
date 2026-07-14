import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getContacto } from '@/lib/site';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const contacto = await getContacto();
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer contacto={contacto} />
      <WhatsAppButton href={contacto.whatsapp} />
    </>
  );
}
