export const getLeaderboard = () => {
    const stored = localStorage.getItem("leaderboard");
    return stored ? JSON.parse(stored) : [];
};

export const saveScore = (name, score) => {
    const leaderboard = getLeaderboard();
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score); // descending order
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0, 10))); // top 10
};
