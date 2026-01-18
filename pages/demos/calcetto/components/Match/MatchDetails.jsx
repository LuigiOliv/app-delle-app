// src/components/Match/MatchDetails.jsx
// © 2025 Luigi Oliviero | Calcetto Rating App | Tutti i diritti riservati

import React, { useState, useEffect } from 'react';
import storage from '../../lib/mockStorage.js';
import utils from '../../lib/utils.js';

const DEFAULT_VOTE_VALUE = 6;

// ============================================================================
// VISTA RISULTATI PARTITA COMPLETED  
// ============================================================================

export function MatchResultsView({ match, users, onBack }) {
    const [matchVotes, setMatchVotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatchVotes();
    }, [match.id]);

    const loadMatchVotes = async () => {
        setLoading(true);
        try {
            const votes = await storage.getMatchVotes(match.id);
            setMatchVotes(votes);
        } catch (error) {
            console.error('Errore caricamento voti partita:', error);
        }
        setLoading(false);
    };

    // Calcola la media voti per ogni giocatore
    const calculatePlayerAverage = (playerId) => {
        const playerVotes = matchVotes
            .map(v => v.votes[playerId])
            .filter(v => v !== undefined);

        if (playerVotes.length === 0) return null;
        return playerVotes.reduce((a, b) => a + b, 0) / playerVotes.length;
    };

    // Conta quanti voti ha ricevuto un giocatore
    const getVoteCount = (playerId) => {
        return matchVotes.filter(v => v.votes[playerId] !== undefined).length;
    };

    // Crea classifica MVP
    const getMVPRanking = () => {
        const allPlayers = [...match.teams.gialli, ...match.teams.verdi];

        return allPlayers
            .map(player => ({
                ...player,
                avgVote: calculatePlayerAverage(player.playerId),
                voteCount: getVoteCount(player.playerId),
                team: match.teams.gialli.find(p => p.playerId === player.playerId) ? 'gialli' : 'verdi'
            }))
            .filter(p => p.avgVote !== null)
            .sort((a, b) => b.avgVote - a.avgVote);
    };

    // Calcola media squadra
    const getTeamAverage = (team) => {
        const teamPlayers = match.teams[team];
        const averages = teamPlayers
            .map(p => calculatePlayerAverage(p.playerId))
            .filter(avg => avg !== null);

        if (averages.length === 0) return null;
        return averages.reduce((a, b) => a + b, 0) / averages.length;
    };

    if (loading) {
        return (
            <div className="section-container">
                <div className="section-header">
                    <h2>Caricamento risultati...</h2>
                </div>
            </div>
        );
    }

    const mvpRanking = getMVPRanking();
    const gialliAvg = getTeamAverage('gialli');
    const verdiAvg = getTeamAverage('verdi');

    return (
        <div className="section-container">
            <div className="results-card">
                {/* HEADER RISULTATO */}
                <div className="results-header">
                    <span className="match-status completed">✅ PARTITA CONCLUSA</span>

                    <div className="results-score">
                        <div className="results-team gialli">
                            <span className="team-name">GIALLI</span>
                            <span className="team-score">{match.score.gialli}</span>
                            {gialliAvg && (
                                <span className="team-avg">Avg: {gialliAvg.toFixed(2)}</span>
                            )}
                        </div>

                        <span className="score-divider">-</span>

                        <div className="results-team verdi">
                            <span className="team-name">VERDI</span>
                            <span className="team-score">{match.score.verdi}</span>
                            {verdiAvg && (
                                <span className="team-avg">Avg: {verdiAvg.toFixed(2)}</span>
                            )}
                        </div>
                    </div>

                    <div className="results-info">
                        <div className="results-date">{utils.formatMatchDateFull(match.date)}</div>
                        {match.topScorer && (
                            <div className="results-top-scorer">
                                🏆 Capocannoniere: {match.topScorer} ({match.topScorerGoals} gol)
                            </div>
                        )}
                    </div>
                </div>

                {/* CLASSIFICA MVP */}
                <div className="results-content">
                    <h3 style={{ textAlign: 'center', color: 'var(--volt)', marginBottom: '20px' }}>
                        ⭐ CLASSIFICA MVP DELLA PARTITA
                    </h3>

                    {/* Mostra messaggio demo */}
                    <div style={{
                        padding: '20px',
                        background: 'rgba(210, 248, 0, 0.1)',
                        border: '1px solid rgba(210, 248, 0, 0.3)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: 'var(--volt)' }}>
                            📊 Statistiche dettagliate disponibili nella versione completa
                        </p>
                    </div>

                    <div className="btn-group" style={{ marginTop: '30px' }}>
                        <button className="btn btn-secondary" onClick={onBack}>
                            ← TORNA ALLE PARTITE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// VISTA VOTAZIONI PARTITA
// ============================================================================

// DEMO SEMPLIFICATA - Votazione con dati mock
export function MatchVotingView({ match, users, onBack }) {
    const [votes, setVotes] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // DEMO: Giocatori mock da votare
    const mockPlayers = [
        { id: 'player_5', name: 'Marco R.', team: 'gialli' },
        { id: 'player_6', name: 'Luca B.', team: 'gialli' },
        { id: 'player_7', name: 'Andrea V.', team: 'gialli' },
        { id: 'player_8', name: 'Paolo C.', team: 'verdi' },
        { id: 'player_9', name: 'Giuseppe E.', team: 'verdi' },
        { id: 'player_10', name: 'Davide R.', team: 'verdi' },
    ];

    // Inizializza voti a 6.0
    useEffect(() => {
        const initialVotes = {};
        mockPlayers.forEach(p => {
            initialVotes[p.id] = 6.0;
        });
        setVotes(initialVotes);
    }, []);

    const handleVoteChange = (playerId, value) => {
        setVotes(prev => ({ ...prev, [playerId]: parseFloat(value) }));
    };

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => {
            alert('✅ Voti inviati con successo! (Simulazione Demo)');
            onBack();
        }, 500);
    };

    const gialliPlayers = mockPlayers.filter(p => p.team === 'gialli');
    const verdiPlayers = mockPlayers.filter(p => p.team === 'verdi');

    return (
        <div className="section-container">
            <div className="voting-card">
                <div className="voting-header">
                    <span className="match-status voting">⭐ DA VOTARE</span>

                    <div className="voting-score">
                        <span className="team-name gialli">GIALLI</span>
                        <span className="score">5 - 4</span>
                        <span className="team-name verdi">VERDI</span>
                    </div>

                    <div className="voting-info">
                        <div className="voting-date">{utils.formatMatchDateFull(match.date)}</div>
                        <div className="voting-note">💡 Vota tutti i giocatori (Demo con dati mock)</div>
                    </div>
                </div>

                <div className="voting-content">
                    {/* SQUADRA GIALLI */}
                    <div className="team-voting-section">
                        <h3 className="team-section-title gialli">🟡 GIALLI</h3>
                        {gialliPlayers.map(player => (
                            <div key={player.id} className="vote-row">
                                <div className="vote-row-name">{player.name}</div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="0.5"
                                    value={votes[player.id] || 6}
                                    onChange={(e) => handleVoteChange(player.id, e.target.value)}
                                    className="vote-slider"
                                    disabled={submitted}
                                />
                                <span className="vote-value">{(votes[player.id] || 6).toFixed(1)}</span>
                            </div>
                        ))}
                    </div>

                    {/* SQUADRA VERDI */}
                    <div className="team-voting-section">
                        <h3 className="team-section-title verdi">🟢 VERDI</h3>
                        {verdiPlayers.map(player => (
                            <div key={player.id} className="vote-row">
                                <div className="vote-row-name">{player.name}</div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="0.5"
                                    value={votes[player.id] || 6}
                                    onChange={(e) => handleVoteChange(player.id, e.target.value)}
                                    className="vote-slider"
                                    disabled={submitted}
                                />
                                <span className="vote-value">{(votes[player.id] || 6).toFixed(1)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="voting-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={onBack}
                        >
                            ← Indietro
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={submitted}
                        >
                            {submitted ? '✓ Voti Inviati' : '✓ INVIA VOTI'}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}