// src/components/ClassifichePage.jsx
// © 2025 Luigi Oliviero | Calcetto Rating App | Tutti i diritti riservati

import { useState, useMemo, useEffect, useRef } from 'react';
import utils from '../lib/utils.js';
import { ROLES, SKILLS, shortSKILLS, SKILLS_GOALKEEPER } from '../lib/constants.js';

/**
 * Pagina per visualizzare le classifiche (Rating, Skill, Portieri, etc.).
 * @param {Array<object>} users - Lista di tutti gli utenti.
 * @param {Array<object>} votes - Lista di tutti i voti.
 * @param {object} currentUser - L'utente corrente.
 * @param {function} onViewProfile - Callback per aprire il profilo di un giocatore.
 */

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const getVoteTimestamp = (vote) => {
    const rawDate = vote.createdAt ?? vote.updatedAt ?? vote.date ?? vote.timestamp;
    if (rawDate === undefined || rawDate === null) return null;
    if (typeof rawDate === 'number') return rawDate;
    const parsed = Date.parse(rawDate);
    return Number.isNaN(parsed) ? null : parsed;
};

function ClassifichePage({ users = [], votes = [], matches = [], matchVotes = [], currentUser, onViewProfile }) {
    const [view, setView] = useState('main'); // 'main' | 'macro-detail' | 'skill-detail'
    const [selectedMacro, setSelectedMacro] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [showMoreOverall, setShowMoreOverall] = useState(false);
    const [showMoreMacros, setShowMoreMacros] = useState({ tecniche: false, tattiche: false, fisiche: false });
    const [activeTab, setActiveTab] = useState('overall');
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const currentUserId = currentUser?.id;
    const voteablePlayersCount = useMemo(() => {
        return users.filter(u => !u.id.startsWith('seed') && (!currentUserId || u.id !== currentUserId)).length;
    }, [users, currentUserId]);
    const hasVoteTargets = voteablePlayersCount > 0;

    // Scroll to top quando cambia la vista
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [view, selectedMacro, selectedSkill]);

    useEffect(() => {
        setShowMoreOverall(false);
        setShowMoreMacros({ tecniche: false, tattiche: false, fisiche: false });
    }, [activeTab]);

    // Conta i voti fatti dall'utente corrente
    const userVotesCount = useMemo(() => {
        if (!currentUserId) return 0;
        const now = Date.now();
        return votes.filter(v => {
            if (v.voterId !== currentUserId) return false;
            const ts = getVoteTimestamp(v);
            if (ts == null) return false;
            return now - ts <= RECENT_WINDOW_MS;
        }).length;
    }, [votes, currentUserId]);

    const canViewLeaderboard = !hasVoteTargets || userVotesCount >= 5;

    // Calcola statistiche overall
    const playersWithOverall = users
        .filter(u => !u.id.startsWith('seed'))
        .map(player => {
            const averages = utils.calculateAverages(player.id, votes, player);
            const overall = utils.calculateOverall(averages);
            const voteCount = utils.countVotes(player.id, votes);
            return { ...player, overall, voteCount, averages };
        })
        .filter(p => p.overall !== null && p.voteCount >= 5)
        .sort((a, b) => b.overall - a.overall);

    // Handler per tornare indietro
    const goBack = () => {
        setView('main');
        setSelectedMacro(null);
        setSelectedSkill(null);
    };

    const tabs = [
        { id: 'overall', label: 'Generale', emoji: '🏆' },
        { id: 'macro', label: 'Macrocategorie', emoji: '📈' },
        { id: 'skill', label: 'Skill', emoji: '⚡' }
    ];
    const tabOrder = tabs.map(tab => tab.id);
    const swipeThreshold = 60;
    const goToTabIndex = (index) => {
        if (index >= 0 && index < tabOrder.length) {
            setActiveTab(tabOrder[index]);
        }
    };
    const handleSwipeDelta = (deltaX) => {
        if (deltaX > swipeThreshold) {
            goToTabIndex(tabOrder.indexOf(activeTab) - 1);
        } else if (deltaX < -swipeThreshold) {
            goToTabIndex(tabOrder.indexOf(activeTab) + 1);
        }
    };
    const handleTouchStart = (event) => {
        touchStartX.current = event.touches[0].clientX;
        touchEndX.current = null;
    };
    const handleTouchMove = (event) => {
        if (touchStartX.current !== null) {
            touchEndX.current = event.touches[0].clientX;
        }
    };
    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            handleSwipeDelta(touchEndX.current - touchStartX.current);
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Se non ha votato abbastanza
    if (!canViewLeaderboard) {
        return (
            <div className="section-container">
                <div className="section-header">
                    <h2>📊 Classifiche</h2>
                </div>

                <div className="no-votes">
                    <h3>🔒 Classifica Bloccata</h3>
                    <p>Per visualizzare le classifiche devi completare almeno 5 valutazioni negli ultimi 7 giorni</p>
                    <p style={{ marginTop: '15px', fontSize: '1.2rem', color: 'var(--volt)' }}>
                        Hai completato: <strong>{userVotesCount}/5</strong> valutazioni negli ultimi 7 giorni
                    </p>
                    <p style={{ marginTop: '10px', opacity: '0.8' }}>
                        Vai alla sezione "Valuta" per votare altri giocatori!
                    </p>
                </div>
            </div>
        );
    }

    // Se non ci sono dati
    if (playersWithOverall.length === 0) {
        return (
            <div className="section-container">
                <div className="section-header">
                    <h2>📊 Classifiche</h2>
                </div>
                <div className="no-votes">
                    <h3>Nessuna classifica disponibile</h3>
                    <p>I giocatori devono ricevere almeno 5 valutazioni per apparire</p>
                </div>
            </div>
        );
    }

    // ==================== VISTA PRINCIPALE ====================
    return (
        <div className="section-container">
            <div className="section-header">
                <h2>📊 Classifiche Complete</h2>
            </div>
            <div className="leaderboard-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`leaderboard-tab ${activeTab === tab.id ? 'leaderboard-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span>{tab.emoji}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            <p className="leaderboard-swipe-hint">↔️ Swipe per cambiare tab</p>
            <div
                className="leaderboard-tabpanels"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <section className={`leaderboard-tabpanel ${activeTab === 'overall' ? '' : 'leaderboard-tabpanel--hidden'}`}>
                    <div className="rankings-overall-section">
                        <h3 className="rankings-section-title">🏆 Classifica Generale</h3>
                        <div className="leaderboard-container">
                            {playersWithOverall.slice(0, showMoreOverall ? undefined : 20).map((player, index) => (
                                <div
                                    key={player.id}
                                    className={`leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}`}
                                    onClick={() => onViewProfile(player.id)}
                                >
                                    <div className="rank-number">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                                    </div>
                                    <div className="avatar">
                                        {player.avatar ? <img src={player.avatar} alt={player.name} /> : utils.getInitials(player.name)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '18px' }}>{player.name} {player.isGoalkeeper && '🧤'}</div>
                                        <div style={{ fontSize: '13px', opacity: 0.8 }}>{player.voteCount} valutazioni</div>
                                    </div>
                                    <div style={{ fontWeight: '800', fontSize: '28px' }}>{utils.toBase10(player.overall).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        {playersWithOverall.length > 20 && (
                            <button className="btn-expand" onClick={() => setShowMoreOverall(!showMoreOverall)}>
                                {showMoreOverall ? '⬆️ Mostra meno' : `⬇️ Mostra altri ${playersWithOverall.length - 20}`}
                            </button>
                        )}
                    </div>
                </section>

                <section className={`leaderboard-tabpanel ${activeTab === 'macro' ? '' : 'leaderboard-tabpanel--hidden'}`}>
                    <h3 className="rankings-section-title" style={{ marginTop: 0 }}>📈 Classifiche per Macrocategoria</h3>
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        background: 'rgba(210, 248, 0, 0.1)',
                        border: '2px solid rgba(210, 248, 0, 0.3)',
                        borderRadius: '12px',
                        margin: '20px'
                    }}>
                        <h3 style={{ color: 'var(--volt)', marginBottom: '15px' }}>
                            🔒 Contenuto non disponibile
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                            Le classifiche dettagliate per Macrocategorie e Skill sono disponibili solo nella versione completa dell'app.
                        </p>
                    </div>
                </section>

                <section className={`leaderboard-tabpanel ${activeTab === 'skill' ? '' : 'leaderboard-tabpanel--hidden'}`}>
                    <h3 className="rankings-section-title" style={{ marginTop: 0 }}>⚡ Top 5 per ogni Skill</h3>
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        background: 'rgba(210, 248, 0, 0.1)',
                        border: '2px solid rgba(210, 248, 0, 0.3)',
                        borderRadius: '12px',
                        margin: '20px'
                    }}>
                        <h3 style={{ color: 'var(--volt)', marginBottom: '15px' }}>
                            🔒 Contenuto non disponibile
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                            Le classifiche dettagliate per Macrocategorie e Skill sono disponibili solo nella versione completa dell'app.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ClassifichePage;