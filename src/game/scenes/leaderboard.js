export const getLeaderboard = () => {
    const stored = localStorage.getItem("leaderboard");
    return stored ? JSON.parse(stored) : [];
};

export const saveScore = (name, score) => {
    if (!name) return;

    const leaderboard = getLeaderboard();

    // Check if player already exists
    const existing = leaderboard.find(entry => entry.name === name);
    if (existing) {
        // Update only if new score is higher
        if (score > existing.score) {
            existing.score = score;
        }
    } else {
        leaderboard.push({ name, score });
    }

    // Sort descending
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep top 10
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0, 10)));
};
