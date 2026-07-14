import './admin.css';
import { AdminShell } from '@/components/admin/AdminShell';
import { ToastProvider } from '@/components/admin/ui';

export const metadata = { title: 'Panel · Dynamics DMG 360' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
