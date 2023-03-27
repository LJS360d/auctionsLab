export function timeLeftUntilDate(date) {
    const timeLeft = new Date(date) - new Date();
    return timeLeft >= 86400000 ? Math.floor(timeLeft / 86400000) + " day(s)" :
        timeLeft >= 3600000 ? Math.floor(timeLeft / 3600000) + " hour(s)" :
            timeLeft >= 60000 ? Math.floor(timeLeft / 60000) + " minute(s)" :
                Math.floor(timeLeft / 1000) + " second(s)";
}