import { useState } from 'react';

export default function AuthPage({ onLogin, users }) {
    const [selectedUserId, setSelectedUserId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedUserId) {
            onLogin(selectedUserId);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>⚽ Sportivity</h1>
                <p>Accedi alla demo per giocare con gli amici e sentirti dentro Fifa!</p>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="google-btn"
                        style={{
                            width: '100%',
                            padding: '15px',
                            marginBottom: '10px',
                            background: 'white',
                            color: '#333',
                            border: '2px solid var(--volt)',
                            cursor: 'pointer'
                        }}
                        required
                    >
                        <option value="">-- Scegli un giocatore per la demo --</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} {user.isAdmin ? '(Admin)' : ''} - {user.preferredRole}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="google-btn"
                        disabled={!selectedUserId}
                        style={{ width: '100%' }}
                    >
                        <span>🔐</span>
                        Entra nella Demo
                    </button>
                </form>

                <p className="login-hint">💡 Demo con dati mock salvati in localStorage</p>
            </div>
        </div>
    );
}
