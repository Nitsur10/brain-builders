export const mockQuestions = [
    {
        id: 1,
        subject: 'Mathematical Reasoning',
        year: 4,
        difficulty: 1,
        question: "What is 15 + 27?",
        options: ["32", "42", "43", "52"],
        correctAnswer: "42",
        explanation: "Add the ones (5+7=12), then add the tens (1+2+1=4). Total is 42!"
    },
    {
        id: 2,
        subject: 'Mathematical Reasoning',
        year: 4,
        difficulty: 2,
        question: "Which of these is a prime number?",
        options: ["9", "15", "17", "21"],
        correctAnswer: "17",
        explanation: "A prime number only has two factors: 1 and itself. 17 is only divisible by 1 and 17."
    },
    {
        id: 3,
        subject: 'Reading',
        year: 4,
        difficulty: 1,
        question: "Which word is a synonym for 'Happy'?",
        options: ["Sad", "Joyful", "Angry", "Tired"],
        correctAnswer: "Joyful",
        explanation: "Synonyms are words that have the same or similar meanings. 'Joyful' means very happy!"
    },
    {
        id: 5,
        subject: 'Mathematical Reasoning',
        year: 5,
        difficulty: 3,
        question: "Solve for x: 3x + 12 = 30",
        options: ["4", "6", "8", "10"],
        correctAnswer: "6",
        explanation: "Subtract 12 from 30 to get 18. Then divide 18 by 3 to get 6."
    },
    {
        id: 6,
        subject: 'Reading',
        year: 5,
        difficulty: 3,
        question: "Which of these is the correct spelling of the plural of 'Phenomenon'?",
        options: ["Phenomenons", "Phenomena", "Phenomenas", "Phenomeni"],
        correctAnswer: "Phenomena",
        explanation: "The word 'phenomenon' comes from Greek, where the -on ending changes to -a in the plural."
    },
    {
        id: 9,
        subject: 'Thinking Skills',
        year: 4,
        difficulty: 2,
        question: "If all Bloops are Razzies, and some Razzies are Lurgs, which must be true?",
        options: ["All Bloops are Lurgs", "Some Bloops might be Lurgs", "No Bloops are Lurgs", "All Lurgs are Bloops"],
        correctAnswer: "Some Bloops might be Lurgs",
        explanation: "Since all Bloops are Razzies, if any of those specific Razzies are also Lurgs, then those Bloops would be Lurgs. But it's not guaranteed."
    },
    {
        id: 10,
        subject: 'Thinking Skills',
        year: 5,
        difficulty: 3,
        question: "A sequence follows: 2, 6, 12, 20, ... What is the next number?",
        options: ["24", "28", "30", "32"],
        correctAnswer: "30",
        explanation: "The differences are +4, +6, +8... so the next difference is +10. 20 + 10 = 30."
    }
];
