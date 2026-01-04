import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, Box, Layers } from 'lucide-react'; // Icone esempio

const Layout = () => {
    const location = useLocation();

    // Funzione helper per evidenziare il link attivo
    const isActive = (path) =>
        location.pathname === path ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100";

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-800">

            {/* SIDEBAR (Desktop) / TOPBAR (Mobile) */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex flex-col shrink-0">
                <div className="mb-8 flex items-center gap-2 px-2">
                    {/* Logo o Nome Agenzia */}
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                    <span className="text-xl font-bold tracking-tight">App.MioSito</span>
                </div>

                <nav className="space-y-1 flex-1">
                    <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/')}`}>
                        <LayoutDashboard size={20} />
                        <span>Panoramica</span>
                    </Link>

                    <div className="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Live Demos
                    </div>

                    <Link to="/app-1" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/app-1')}`}>
                        <Zap size={20} />
                        <span>Demo 1: AI Chat</span>
                    </Link>

                    <Link to="/app-2" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/app-2')}`}>
                        <Box size={20} />
                        <span>Demo 2: Dashboard</span>
                    </Link>

                    <Link to="/app-3" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/app-3')}`}>
                        <Layers size={20} />
                        <span>Demo 3: Utility</span>
                    </Link>
                </nav>

                {/* Footer Sidebar */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                    <a href="https://miosito.it" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-2">
                        &larr; Torna al sito Agency
                    </a>
                </div>
            </aside>

            {/* AREA CONTENUTO PRINCIPALE */}
            <main className="flex-1 bg-gray-50 overflow-y-auto h-screen p-4 md:p-8">
                {/* Qui verranno renderizzate le pagine (Home o Demo) grazie a Outlet */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;