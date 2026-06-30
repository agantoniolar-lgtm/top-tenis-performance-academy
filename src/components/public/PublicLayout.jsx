import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { PublicContentProvider } from '../../contexts/PublicContent';

export default function PublicLayout() {
  return (
    <PublicContentProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </PublicContentProvider>
  );
}
