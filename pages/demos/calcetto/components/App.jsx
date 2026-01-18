import { useState, useEffect } from 'react';
import storage from '../lib/mockStorage.js';
import utils from '../lib/utils.js';
import { ADMIN_EMAIL } from '../lib/constants.js';
import Header from './Navigation/Header.jsx';
import AuthPage from './AuthPage.jsx';
import { ClaimProfileModal, RoleSelectionModal, RoleEditModal, ProfileSelectorModal } from './Modals.jsx';
import MatchesPage from './MatchesPage.jsx';
import MatchDetailRouter from './MatchDetailRouter.jsx';
import PlayersListPage from './PlayersListPage.jsx';
import PlayerProfile from './PlayerProfile.jsx';
import ClassifichePage from './ClassifichePage.jsx';
import { AdminPage, DebugPage, SettingsPage } from './AdminAndSettings.jsx';
import RatingForm from './RatingForm.jsx';

function App() {
    const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());
    const [activeTab, setActiveTab] = useState('partite');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [viewingProfile, setViewingProfile] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [users, setUsers] = useState([]);
    const [votes, setVotes] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const loadedUsers = await storage.getUsers();
                const loadedVotes = await storage.getVotes();
                setUsers(loadedUsers || []);
                setVotes(loadedVotes || []);

                // Check if current user needs role selection
                if (currentUser && !currentUser.preferredRole) {
                    setShowRoleModal(true);
                }
            } catch (error) {
                console.error('❌ Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentUser]);

    const handleLogin = (userId) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
            storage.setCurrentUser(user);
            if (!user.preferredRole) {
                setShowRoleModal(true);
            }
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        storage.setCurrentUser(null);
    };

    const handleDeleteAccount = async () => {
        const confirm1 = window.confirm(
            '⚠️ DEMO MODE\n\n' +
            'Nella versione demo, questa azione rimuoverà solo i tuoi dati da localStorage.\n\n' +
            'Vuoi continuare?'
        );

        if (!confirm1) return;

        const confirm2 = window.prompt(
            `Per confermare, scrivi il tuo nome esatto: "${currentUser.name}"`
        );

        if (confirm2 !== currentUser.name) {
            alert('❌ Nome non corretto. Eliminazione annullata.');
            return;
        }

        try {
            await storage.deleteMatch(currentUser.id);
            alert('✓ Account eliminato dalla demo.');
            handleLogout();
            window.location.reload();
        } catch (error) {
            console.error('❌ Error deleting account:', error);
            alert('❌ Errore durante l\'eliminazione.');
        }
    };

    const handleVoteSubmit = async (playerId, ratings) => {
        const newVote = {
            voterId: currentUser.id,
            voterName: currentUser.name,
            voterEmail: currentUser.email,
            playerId,
            ratings,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };
        await storage.addVote(newVote);
        const updatedVotes = [...votes, newVote];
        setVotes(updatedVotes);
        setSelectedPlayer(null);
    };

    const handleRolesSave = async (preferredRole, otherRoles) => {
        const isGoalkeeper = preferredRole === 'Portiere';
        const updatedCurrentUser = {
            ...currentUser,
            preferredRole,
            otherRoles,
            isGoalkeeper
        };
        await storage.updateUser(updatedCurrentUser);
        const updatedUsers = users.map(u =>
            u.id === currentUser.id ? updatedCurrentUser : u
        );
        setUsers(updatedUsers);
        setCurrentUser(updatedCurrentUser);
        storage.setCurrentUser(updatedCurrentUser);
        setShowRoleModal(false);
    };

    if (loading) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <h1>⚽ Sportivity Demo</h1>
                    <p>Caricamento in corso...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <AuthPage onLogin={handleLogin} users={users} />;
    }

    // Check for incomplete profile
    if (currentUser && currentUser.preferredRole) {
        const isGoalkeeper = currentUser.preferredRole === 'Portiere';
        const hasIncompleteProfile = !isGoalkeeper &&
            (!currentUser.otherRoles || currentUser.otherRoles.length < 2);

        if (hasIncompleteProfile) {
            return (
                <div className="app-container">
                    <Header
                        user={currentUser}
                        onLogout={handleLogout}
                        onOpenSettings={() => { }}
                        setActiveTab={setActiveTab}
                    />
                    <div className="modal-overlay" style={{ position: 'fixed' }}>
                        <div className="modal-content">
                            <h2>⚠️ Profilo Incompleto</h2>
                            <p style={{ marginBottom: '20px' }}>
                                Il tuo profilo necessita di un aggiornamento per continuare.
                            </p>
                            <button
                                className="btn btn-primary full-width"
                                onClick={() => setShowRoleModal(true)}
                            >
                                📝 Completa il Profilo
                            </button>
                        </div>
                    </div>
                    {showRoleModal && (
                        <RoleEditModal
                            user={currentUser}
                            onClose={() => { }}
                            onSuccess={async () => {
                                const updatedUsers = await storage.getUsers();
                                const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
                                setCurrentUser(updatedUser);
                                storage.setCurrentUser(updatedUser);
                                setShowRoleModal(false);
                            }}
                        />
                    )}
                </div>
            );
        }
    }

    return (
        <div className="app-container">
            {showRoleModal && <RoleSelectionModal onSave={handleRolesSave} />}

            <Header
                user={currentUser}
                onLogout={handleLogout}
                onOpenSettings={() => setActiveTab('impostazioni')}
                setActiveTab={setActiveTab}
            />

            <div className="nav-tabs">
                <button
                    className={`nav-tab ${activeTab === 'partite' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('partite');
                        setSelectedPlayer(null);
                        setViewingProfile(null);
                        setSelectedMatch(null);
                    }}
                >
                    🏆 Partite
                </button>
                <button
                    className={`nav-tab ${activeTab === 'valuta' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('valuta');
                        setSelectedPlayer(null);
                        setViewingProfile(null);
                    }}
                >
                    ⚽ Valuta
                </button>
                <button
                    className={`nav-tab ${activeTab === 'profilo' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('profilo');
                        setSelectedPlayer(null);
                        setViewingProfile(null);
                    }}
                >
                    👤 Profilo
                </button>
                <button
                    className={`nav-tab ${activeTab === 'classifiche' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('classifiche');
                        setSelectedPlayer(null);
                        setViewingProfile(null);
                    }}
                >
                    📊 Classifiche
                </button>
            </div>

            <div className="content">
                {viewingProfile ? (
                    users.find(u => u.id === viewingProfile) ? (
                        <PlayerProfile
                            player={users.find(u => u.id === viewingProfile)}
                            votes={votes}
                            isOwnProfile={viewingProfile === currentUser.id}
                        />
                    ) : null
                ) : selectedPlayer ? (
                    users.find(u => u.id === selectedPlayer) ? (
                        <RatingForm
                            player={users.find(u => u.id === selectedPlayer)}
                            onSubmit={handleVoteSubmit}
                            onCancel={() => setSelectedPlayer(null)}
                        />
                    ) : null
                ) : activeTab === 'partite' ? (
                    selectedMatch ? (
                        <MatchDetailRouter
                            matchId={selectedMatch}
                            currentUser={currentUser}
                            onBack={() => setSelectedMatch(null)}
                        />
                    ) : (
                        <MatchesPage
                            currentUser={currentUser}
                            users={users}
                            onSelectMatch={setSelectedMatch}
                        />
                    )
                ) : activeTab === 'valuta' ? (
                    <PlayersListPage
                        users={users}
                        currentUser={currentUser}
                        votes={votes}
                        onSelectPlayer={setSelectedPlayer}
                    />
                ) : activeTab === 'profilo' ? (
                    <PlayerProfile
                        player={currentUser}
                        votes={votes}
                        isOwnProfile={true}
                    />
                ) : activeTab === 'classifiche' ? (
                    <ClassifichePage
                        users={users}
                        votes={votes}
                        currentUser={currentUser}
                        onViewProfile={setViewingProfile}
                    />
                ) : activeTab === 'admin' && currentUser.isAdmin ? (
                    <AdminPage
                        users={users}
                        setUsers={setUsers}
                        votes={votes}
                        setVotes={setVotes}
                    />
                ) : activeTab === 'debug' && currentUser.isAdmin ? (
                    <DebugPage users={users} votes={votes} />
                ) : (
                    <SettingsPage
                        user={currentUser}
                        onUpdateUser={async (updatedUser) => {
                            await storage.updateUser(updatedUser);
                            const updatedUsers = users.map(u =>
                                u.id === updatedUser.id ? updatedUser : u
                            );
                            setUsers(updatedUsers);
                            setCurrentUser(updatedUser);
                            storage.setCurrentUser(updatedUser);
                        }}
                        onDeleteAccount={handleDeleteAccount}
                    />
                )}
            </div>
        </div>
    );
}

export default App;