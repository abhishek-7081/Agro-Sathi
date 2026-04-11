import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingMLButton from '../ui/FloatingMLButton';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingMLButton />
    </div>
  );
}
