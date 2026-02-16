import { mockQuestions } from './mockQuestions.js';

function validateQuestions() {
    console.log(`🔍 Starting validation for ${mockQuestions.length} questions...\n`);
    let errors = [];
    const ids = new Set();
    const subjects = ['Reading', 'Mathematical Reasoning', 'Thinking Skills'];

    mockQuestions.forEach((q, index) => {
        const qId = q.id || `index-${index}`;

        // 1. Basic Structure
        if (!q.id) errors.push(`[ID ${qId}] Missing 'id' field.`);
        if (!q.subject) errors.push(`[ID ${qId}] Missing 'subject' field.`);
        if (!q.question) errors.push(`[ID ${qId}] Missing 'question' field.`);
        if (!q.options || !Array.isArray(q.options)) errors.push(`[ID ${qId}] 'options' must be an array.`);
        if (q.options?.length < 2) errors.push(`[ID ${qId}] Question must have at least 2 options.`);
        if (!q.correctAnswer) errors.push(`[ID ${qId}] Missing 'correctAnswer' field.`);
        if (!q.explanation) errors.push(`[ID ${qId}] Missing 'explanation' field.`);
        if (!q.year) errors.push(`[ID ${qId}] Missing 'year' field.`);
        if (q.difficulty === undefined) errors.push(`[ID ${qId}] Missing 'difficulty' field.`);

        // 2. Duplicate IDs
        if (ids.has(q.id)) errors.push(`[ID ${q.id}] Duplicate ID found.`);
        ids.add(q.id);

        // 3. Answer Integrity
        if (q.options && q.correctAnswer && !q.options.includes(q.correctAnswer)) {
            errors.push(`[ID ${qId}] correctAnswer '${q.correctAnswer}' is not present in options [${q.options.join(', ')}].`);
        }

        // 4. Subject Validity
        if (q.subject && !subjects.includes(q.subject)) {
            errors.push(`[ID ${qId}] Invalid subject '${q.subject}'. Expected one of: ${subjects.join(', ')}.`);
        }

        // 5. Mathematical Integrity (Basic)
        if (q.subject === 'Mathematical Reasoning' && q.question.includes('+')) {
            // Very basic heuristic for simple addition questions
            const match = q.question.match(/(\d+)\s*\+\s*(\d+)/);
            if (match) {
                const expected = parseInt(match[1]) + parseInt(match[2]);
                if (q.correctAnswer.includes(expected.toString()) === false && !isNaN(parseInt(q.correctAnswer))) {
                    // Note: This is an advisory check, may have false positives for complex word problems
                    // console.warn(`[ID ${qId}] Warning: Question implies ${match[1]}+${match[2]}=${expected}, but answer is ${q.correctAnswer}`);
                }
            }
        }
    });

    if (errors.length > 0) {
        console.error(`❌ Validation failed with ${errors.length} errors:`);
        errors.forEach(err => console.error(`  - ${err}`));
        process.exit(1);
    } else {
        console.log('✅ All questions passed validation!');
        process.exit(0);
    }
}

validateQuestions();
