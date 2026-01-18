// Mock storage using localStorage instead of Firebase
const STORAGE_KEYS = {
    USERS: 'calcetto_demo_users',
    VOTES: 'calcetto_demo_votes',
    MATCHES: 'calcetto_demo_matches',
    CURRENT_USER: 'calcetto_demo_current_user'
};

const mockStorage = {
    // USERS
    getUsers: async () => {
        const data = localStorage.getItem(STORAGE_KEYS.USERS);
        return data ? JSON.parse(data) : [];
    },

    updateUser: async (user) => {
        const users = await mockStorage.getUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index >= 0) {
            users[index] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },

    getCurrentUser: () => {
        const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    },

    setCurrentUser: (user) => {
        if (user) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
    },

    // VOTES
    getVotes: async () => {
        const data = localStorage.getItem(STORAGE_KEYS.VOTES);
        return data ? JSON.parse(data) : [];
    },

    addVote: async (vote) => {
        const votes = await mockStorage.getVotes();
        votes.push({ ...vote, id: `vote_${Date.now()}_${Math.random()}` });
        localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
    },

    // MATCHES
    getMatches: async () => {
        const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
        const matches = data ? JSON.parse(data) : [];
        return matches.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    getMatch: async (matchId) => {
        const matches = await mockStorage.getMatches();
        return matches.find(m => m.id === matchId) || null;
    },

    createMatch: async (matchData) => {
        const matches = await mockStorage.getMatches();
        const newMatch = {
            id: `match_${Date.now()}`,
            ...matchData,
            status: 'OPEN',
            teams: { gialli: [], verdi: [] },
            score: null,
            createdAt: Date.now()
        };
        matches.push(newMatch);
        localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
        return newMatch.id;
    },

    updateMatch: async (matchId, updates) => {
        const matches = await mockStorage.getMatches();
        const index = matches.findIndex(m => m.id === matchId);
        if (index >= 0) {
            matches[index] = { ...matches[index], ...updates };
            localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
        }
    },

    deleteMatch: async (matchId) => {
        const matches = await mockStorage.getMatches();
        const filtered = matches.filter(m => m.id !== matchId);
        localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(filtered));
        // Clean up related data
        localStorage.removeItem(`${STORAGE_KEYS.MATCHES}_registrations_${matchId}`);
        localStorage.removeItem(`${STORAGE_KEYS.MATCHES}_votes_${matchId}`);
    },

    // REGISTRATIONS
    getRegistrations: async (matchId) => {
        const key = `${STORAGE_KEYS.MATCHES}_registrations_${matchId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    registerPlayer: async (matchId, player) => {
        const regs = await mockStorage.getRegistrations(matchId);
        regs.push({
            id: player.id,
            playerId: player.id,
            playerName: player.name,
            isGoalkeeper: player.isGoalkeeper || false,
            registeredAt: Date.now(),
            registeredBy: player.id
        });
        const key = `${STORAGE_KEYS.MATCHES}_registrations_${matchId}`;
        localStorage.setItem(key, JSON.stringify(regs));
    },

    unregisterPlayer: async (matchId, playerId) => {
        const regs = await mockStorage.getRegistrations(matchId);
        const filtered = regs.filter(r => r.playerId !== playerId);
        const key = `${STORAGE_KEYS.MATCHES}_registrations_${matchId}`;
        localStorage.setItem(key, JSON.stringify(filtered));
    },

    // MATCH VOTES
    getMatchVotes: async (matchId) => {
        const key = `${STORAGE_KEYS.MATCHES}_votes_${matchId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    getMyMatchVote: async (matchId, voterId) => {
        const votes = await mockStorage.getMatchVotes(matchId);
        return votes.find(v => v.voterId === voterId) || null;
    },

    saveMatchVote: async (matchId, voterId, voterTeam, votes) => {
        const matchVotes = await mockStorage.getMatchVotes(matchId);
        const existing = matchVotes.findIndex(v => v.voterId === voterId);
        const voteData = {
            id: voterId,
            voterId,
            voterTeam,
            votes,
            submittedAt: Date.now(),
            lastModifiedAt: Date.now()
        };

        if (existing >= 0) {
            matchVotes[existing] = voteData;
        } else {
            matchVotes.push(voteData);
        }

        const key = `${STORAGE_KEYS.MATCHES}_votes_${matchId}`;
        localStorage.setItem(key, JSON.stringify(matchVotes));
    },

    // Mock login (no Firebase)
    handleLogin: async () => {
        return null;
    },

    // Check and update match status (simplified)
    checkAndUpdateMatchStatus: async (match) => {
        return match;
    }
};

export default mockStorage;