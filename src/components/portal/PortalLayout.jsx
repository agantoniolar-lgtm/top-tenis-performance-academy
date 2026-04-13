import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#1B3A2A] flex items-center px-4 z-30">
        <button
          className="text-white mr-3"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <span className="text-white font-bold">Top Tenis</span>
      </div>

      {/* Main content */}
      <main className="lg:ml-60 pt-14 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
