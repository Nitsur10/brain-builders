class CoachingAgent {
    getFeedback(profile, lastResult) {
        if (!lastResult) return "Hi! I'm your Brain. Let's start building! 💡";

        const { isCorrect, subject } = lastResult;
        const { streak, difficulty } = profile;

        if (isCorrect) {
            if (streak >= 3) {
                return `WOW! A ${streak}-streak in ${subject}! Your brain is absolutely glowing! 🌟`;
            }
            if (difficulty > 1) {
                return `Great job! You handled that Level ${difficulty} question like a pro!`;
            }
            return `Correct! You're getting stronger at ${subject}!`;
        } else {
            // Growth mindset feedback
            return `That was a tough one! Don't worry, your brain grows every time you try something hard. Let's try an easier one to warm up!`;
        }
    }

    getEncouragement() {
        const messages = [
            "Keep going! Your brain is a muscle! 💪",
            "I love how hard you're working!",
            "Every mistake is a new discovery!",
            "You're doing amazing! 🌈"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
}

export default new CoachingAgent();
