import { ReportSelector } from '@/components/ReportSelector';
import { Toaster } from 'sonner';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <Toaster position="top-center" />
      <ReportSelector />
    </div>
  );
}