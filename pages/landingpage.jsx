import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12">

            {/* Hero Section */}
            <section className="text-center py-10 space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Non immaginare la tua App.<br />
                    <span className="text-blue-600">Guardala funzionare.</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Sviluppo soluzioni web reattive, scalabili e potenziate dall'AI.
                    Questa non è solo una landing page, è la tua prima prova tecnica.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                    <Link to="/app-1" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
                        Prova la Demo AI
                    </Link>
                    <a href="mailto:tuo@email.it" className="bg-white text-slate-700 border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all">
                        Parliamo del progetto
                    </a>
                </div>
            </section>

            {/* Grid delle Demo */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Cosa posso costruire per te?</h2>
                <div className="grid md:grid-cols-3 gap-6">

                    {/* Card Demo 1 */}
                    <Link to="/app-1" className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all h-full">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                                1
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600">Nome Demo 1</h3>
                            <p className="text-gray-500 text-sm">Descrizione breve di cosa fa questa app (es. Generazione testi AI).</p>
                        </div>
                    </Link>

                    {/* Card Demo 2 */}
                    <Link to="/app-2" className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all h-full">
                            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 transition-transform">
                                2
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600">Nome Demo 2</h3>
                            <p className="text-gray-500 text-sm">Descrizione breve (es. Dashboard analitica interattiva).</p>
                        </div>
                    </Link>

                    {/* Card Demo 3 */}
                    <Link to="/app-3" className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all h-full">
                            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600 group-hover:scale-110 transition-transform">
                                3
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-green-600">Nome Demo 3</h3>
                            <p className="text-gray-500 text-sm">Descrizione breve (es. Tool di calcolo o gestione).</p>
                        </div>
                    </Link>

                </div>
            </section>
        </div>
    );
};

export default LandingPage;