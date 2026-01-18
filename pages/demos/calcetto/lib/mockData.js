import { ROLES, SKILLS, SKILLS_GOALKEEPER } from './constants.js';


// Nomi realistici
const FIRST_NAMES = ['Luigi', 'Marco', 'Andrea', 'Luca', 'Giovanni', 'Francesco', 'Antonio', 'Giuseppe', 'Davide', 'Matteo', 'Alessandro', 'Simone', 'Federico', 'Roberto', 'Stefano', 'Vincenzo', 'Salvatore', 'Paolo', 'Fabio', 'Massimo'];
const LAST_NAMES = ['Rossi', 'Bianchi', 'Verdi', 'Russo', 'Ferrari', 'Esposito', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'Costa', 'Gatti', 'Fontana', 'Barbieri', 'Santoro', 'Marini'];


const LOCATIONS = [
    'Stadio Comunale, Napoli',
    'Centro Sportivo, Milano',
    'Campo Paradiso, Roma',
    'Arena Verde, Torino',
    'Stadio Blu, Firenze'
];

// Generate random player
function generatePlayer(id, isGoalkeeper = false) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const preferredRole = isGoalkeeper ? 'Portiere' : ROLES[Math.floor(Math.random() * (ROLES.length - 1)) + 1];

    const availableOtherRoles = ROLES.filter(r => r !== preferredRole && (!isGoalkeeper || r !== 'Portiere'));
    const otherRoles = [];
    if (!isGoalkeeper) {
        const numOtherRoles = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numOtherRoles && i < availableOtherRoles.length; i++) {
            const role = availableOtherRoles[Math.floor(Math.random() * availableOtherRoles.length)];
            if (!otherRoles.includes(role)) otherRoles.push(role);
        }
    }

    return {
        id,
        name: `${firstName} ${lastName.charAt(0)}.`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@demo.com`,
        avatar: null,
        preferredRole,
        otherRoles,
        claimed: true,
        isAdmin: id === 'player_1',
        isGoalkeeper,
        isInitialPlayer: true,
        hasVotedOffline: false
    };
}

// Generate realistic vote (1-4 scale)
function generateVote(voterId, votedPlayerId, voterName, player) {
    const skills = player.isGoalkeeper ?
        [...SKILLS_GOALKEEPER.tecniche, ...SKILLS_GOALKEEPER.tattiche, ...SKILLS_GOALKEEPER.fisiche] :
        [...SKILLS.tecniche, ...SKILLS.tattiche, ...SKILLS.fisiche];

    const ratings = {};
    skills.forEach(skill => {
        const rand = Math.random();
        if (rand < 0.1) ratings[skill] = 1;
        else if (rand < 0.3) ratings[skill] = 2;
        else if (rand < 0.7) ratings[skill] = 3;
        else ratings[skill] = 4;
    });

    return {
        voterId,
        voterName,
        voterEmail: `${voterName.toLowerCase().replace(/\s/g, '.')}@demo.com`,
        playerId: votedPlayerId,
        ratings,
        timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
        date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
    };
}

// Generate match
function generateMatch(id, daysFromNow, status, allPlayers) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(21, 20, 0, 0);

    const votingDeadline = new Date(date);
    votingDeadline.setDate(votingDeadline.getDate() + 6);
    votingDeadline.setHours(23, 59, 59, 0);

    const registrationDeadline = new Date(date);
    registrationDeadline.setMinutes(registrationDeadline.getMinutes() - 50);

    const match = {
        id,
        date: date.toISOString(),
        location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
        maxPlayers: 18,
        status,
        registrationDeadlineForced: registrationDeadline.toISOString(),
        votingDeadline: votingDeadline.toISOString(),
        teams: { gialli: [], verdi: [] },
        score: null,
        topScorer: null,
        topScorerGoals: null,
        createdAt: Date.now() - (7 - daysFromNow) * 24 * 60 * 60 * 1000
    };

    let shuffled = []; // AGGIUNGI QUESTA RIGA

    if (status === 'VOTING' || status === 'COMPLETED') {
        // Genera team con giocatori casuali
        shuffled = [...allPlayers].sort(() => Math.random() - 0.5); // RIMUOVI const qui
        const numPlayers = Math.floor(Math.random() * 6) + 12;

        for (let i = 0; i < numPlayers && i < shuffled.length; i++) {
            const player = shuffled[i];
            const team = i % 2 === 0 ? 'gialli' : 'verdi';
            match.teams[team].push({
                playerId: player.id,
                playerName: player.name,
                isGoalkeeper: player.isGoalkeeper
            });
        }
    }

    if (status === 'COMPLETED') {
        match.score = {
            gialli: Math.floor(Math.random() * 6) + 3,
            verdi: Math.floor(Math.random() * 6) + 3
        };

        // Teams già popolati sopra, aggiungi solo topScorer
        match.topScorer = shuffled[0]?.name || 'Marco R.';
        match.topScorerGoals = Math.floor(Math.random() * 3) + 1;


        // Genera voti per questa partita
        const matchVotes = [];
        const yellowPlayers = match.teams.gialli.map(p => p.playerId);
        const greenPlayers = match.teams.verdi.map(p => p.playerId);

        // Ogni giocatore vota gli altri del team avversario
        [...yellowPlayers, ...greenPlayers].forEach((voterId, idx) => {
            const isYellow = yellowPlayers.includes(voterId);
            const playersToVote = isYellow ? greenPlayers : yellowPlayers;

            const votes = {};
            playersToVote.forEach(playerId => {
                votes[playerId] = parseFloat((Math.random() * 3 + 5.5).toFixed(1)); // Numero!
            });

            matchVotes.push({
                id: voterId,
                voterId,
                voterTeam: isYellow ? 'gialli' : 'verdi',
                votes,
                submittedAt: Date.now() - Math.abs(daysFromNow) * 24 * 60 * 60 * 1000,
                lastModifiedAt: Date.now() - Math.abs(daysFromNow) * 24 * 60 * 60 * 1000
            });
        });

        localStorage.setItem(`calcetto_demo_matches_votes_${id}`, JSON.stringify(matchVotes));
    }

    return match;
}

// Initialize mock data
export function initializeMockData() {
    if (localStorage.getItem('calcetto_demo_users')) {
        console.log('✅ Mock data already initialized');
        return;
    }

    console.log('🔄 Initializing Calcetto mock data...');

    const users = [];
    for (let i = 1; i <= 8; i++) {
        const isGoalkeeper = i === 2 || i === 5;
        users.push(generatePlayer(`player_${i}`, isGoalkeeper));
    }

    const votes = [];
    users.forEach((votedPlayer) => {
        const numVotes = Math.floor(Math.random() * 6) + 8;
        const voters = users.filter(u => u.id !== votedPlayer.id);

        for (let i = 0; i < numVotes; i++) {
            const voter = voters[Math.floor(Math.random() * voters.length)];
            votes.push(generateVote(voter.id, votedPlayer.id, voter.name, votedPlayer));
        }
    });

    // DEMO: Fai votare l'admin (player_1) a molti giocatori per vedere le classifiche
    const admin = users[0]; // player_1
    users.forEach(votedPlayer => {
        if (votedPlayer.id === admin.id) return; // Non votare se stesso

        // Admin vota i primi 9 giocatori (escludendo se stesso)
        const playerIndex = parseInt(votedPlayer.id.split('_')[1]);
        if (playerIndex <= 9) {
            votes.push(generateVote(admin.id, votedPlayer.id, admin.name, votedPlayer));
        }
    });

    const matches = [
        generateMatch('match_1', 7, 'OPEN', users),
        generateMatch('match_2', -3, 'VOTING', users),
        generateMatch('match_3', -10, 'COMPLETED', users),
        generateMatch('match_4', -17, 'COMPLETED', users),
    ];

    localStorage.setItem('calcetto_demo_users', JSON.stringify(users));
    localStorage.setItem('calcetto_demo_votes', JSON.stringify(votes));
    localStorage.setItem('calcetto_demo_matches', JSON.stringify(matches));
    localStorage.setItem('calcetto_demo_current_user', JSON.stringify(users[0]));

    console.log('✅ Mock data initialized:', {
        users: users.length,
        votes: votes.length,
        matches: matches.length
    });
}

export function resetMockData() {
    console.log('🔄 Resetting Calcetto demo data...');

    const keys = Object.keys(localStorage).filter(key => key.startsWith('calcetto_demo'));
    keys.forEach(key => localStorage.removeItem(key));

    initializeMockData();
    console.log('✅ Demo data reset complete');
}