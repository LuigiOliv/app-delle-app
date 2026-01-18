import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout.jsx';
import LandingPage from '../pages/landingpage.jsx';

// Importazione Lazy delle tue 3 Demo (così non pesano sulla home iniziale)
const DemoOne = lazy(() => import('../pages/demos/Demo1'));
const DemoTwo = lazy(() => import('../pages/demos/Demo2'));
const DemoThree = lazy(() => import('../pages/demos/Demo3'));

// Un componente di caricamento semplice mentre scarica il bundle della demo
const Loading = () => (
    <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-semibold text-blue-600 animate-pulse">
            Caricamento App...
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    {/* Il Layout avvolge tutto: Header/Nav rimangono fissi */}
                    <Route path="/" element={<Layout />}>

                        {/* Pagina Home (Marketing) */}
                        <Route index element={<LandingPage />} />

                        {/* Le tue 3 Demo */}
                        <Route path="app-1" element={<DemoOne />} />
                        <Route path="app-2" element={<DemoTwo />} />
                        <Route path="app-3" element={<DemoThree />} />

                        {/* Pagina 404/Fallback */}
                        <Route path="*" element={<div className="p-10">Pagina non trovata</div>} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;