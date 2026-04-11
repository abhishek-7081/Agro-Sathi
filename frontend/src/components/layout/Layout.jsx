import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingActionButton from '../ui/FloatingActionButton';
import FloatingMLButton from '../ui/FloatingMLButton';

export default function Layout() {
  return (
    <div className="app-shell flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
        <FloatingMLButton />
        <FloatingActionButton />
      </div>
    </div>
  );
}
