import React, { useState } from 'react';

export default function Demo2() {
    const [matches] = useState([
        { home: 'Dragons', away: 'Tigers', score: '24-18', status: 'Finita' },
        { home: 'Lions', away: 'Bears', score: '31-27', status: 'Finita' },
        { home: 'Eagles', away: 'Sharks', score: '15-12', status: 'In corso' },
    ]);

    const [standings] = useState([
        { team: 'Dragons', played: 8, won: 6, lost: 2, points: 28 },
        { team: 'Lions', played: 8, won: 5, lost: 3, points: 24 },
        { team: 'Tigers', played: 8, won: 4, lost: 4, points: 20 },
        { team: 'Bears', played: 8, won: 3, lost: 5, points: 16 },
    ]);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-8 rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold mb-2">🏉 Rugby Manager</h1>
                <p className="text-red-100">Gestione campionato e statistiche di squadra</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        📅 Ultimi Match
                    </h2>
                    <div className="space-y-3">
                        {matches.map((match, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">{match.home}</span>
                                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                        {match.status}
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-center text-purple-600 my-2">
                                    {match.score}
                                </div>
                                <div className="text-right font-semibold text-gray-700">
                                    {match.away}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        🏆 Classifica
                    </h2>
                    <table className="w-full">
                        <thead className="text-left text-sm text-gray-500 border-b">
                            <tr>
                                <th className="pb-2">Squadra</th>
                                <th className="pb-2 text-center">G</th>
                                <th className="pb-2 text-center">V</th>
                                <th className="pb-2 text-center">P</th>
                                <th className="pb-2 text-right">Pt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {standings.map((team, idx) => (
                                <tr key={idx} className="border-b last:border-0">
                                    <td className="py-3 font-semibold">{team.team}</td>
                                    <td className="text-center text-gray-600">{team.played}</td>
                                    <td className="text-center text-green-600 font-semibold">{team.won}</td>
                                    <td className="text-center text-red-600">{team.lost}</td>
                                    <td className="text-right font-bold text-purple-600">{team.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl">
                <h3 className="font-semibold text-purple-900 mb-2">✨ Funzionalità</h3>
                <ul className="grid md:grid-cols-2 gap-2 text-sm text-purple-800">
                    <li>✓ Gestione partite e risultati</li>
                    <li>✓ Classifica aggiornata in tempo reale</li>
                    <li>✓ Statistiche giocatori</li>
                    <li>✓ Calendario incontri</li>
                </ul>
            </div>
        </div>
    );
}