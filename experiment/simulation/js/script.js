// --- Global problem state ---
let problem = {
    activeExperiment: 1, // 1 for Generator, 2 for Parity Check
    m: 4,
    r_base: 1,     // The 'r' the user sees, e.g., RM(r, m)
    r_problem: 1,  // The 'r' used for the logic (r for Exp1, m-r-1 for Exp2)
    correctDistance: 8,
    correctAbsentMonomialIDs: [],
    optionMap: {}
};

// --- Pool of available monomials and bad vectors for m=4 ---
const monomialPool = {
    m: 4,
    badVectors: [
        { id: 'bad1', degree: -1, vector: '(1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0)' },
        { id: 'bad2', degree: -1, vector: '(1,1,1,1, 0,0,0,0, 0,0,0,0, 0,0,0,0)' }
    ],
    byDegree: {
        0: [ // Added for robustness (e.g., if r_base = 3, r_problem = 0)
            { id: 'm_0', degree: 0, vector: '(1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1)' }, // 1
            { id: 'm_0_alt', degree: 0, vector: '(1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1)' } // 1 (copy)
        ],
        1: [
            { id: 'm_1', degree: 1, vector: '(0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1)' }, // X1
            { id: 'm_4', degree: 1, vector: '(0,0,0,0, 0,0,0,0, 1,1,1,1, 1,1,1,1)' }  // X4
        ],
        2: [
            { id: 'm_13', degree: 2, vector: '(0,0,0,0, 0,1,0,1, 0,0,0,0, 0,1,0,1)' }, // X1*X3
            { id: 'm_24', degree: 2, vector: '(0,0,0,0, 0,0,1,1, 0,0,0,0, 0,0,1,1)' }  // X2*X4
        ],
        3: [
            { id: 'm_123', degree: 3, vector: '(0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1)' }, // X1*X2*X3
            { id: 'm_134', degree: 3, vector: '(0,0,0,0, 0,0,0,0, 0,1,0,1, 0,1,0,1)' }  // X1*X3*X4
        ],
        4: [
            { id: 'm_1234', degree: 4, vector: '(0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1)' } // X1*X2*X3*X4
        ]
    }
};

// --- Text Content for Experiments ---
const expContent = {
    1: { // Generator Matrix
        instructions: `
            <ul style="list-style: disc;">
                <li><strong>Step 1:</strong> Read the parameters r and m for the Reed-Muller code.</li>
                <li><strong>Step 2:</strong> For Part 1, analyze the given binary vectors. Select all vectors that <strong>do not</strong> belong in the generator matrix of RM(r, m). (i.e., their monomial has degree > r or is invalid).</li>
                <li><strong>Step 3:</strong> Submit Part 1. If correct, Part 2 will appear.</li>
                <li><strong>Step 4:</strong> For Part 2, select the correct minimum distance d of the RM(r, m) code.</li>
            </ul>`,
        part1Title: "Which of the following vectors <strong>do not</strong> correspond to a row in the <strong>generator matrix</strong> of this code?",
        part2Title: "What is the <strong>minimum distance d</strong> of this RM(r, m) code?"
    },
    2: { // Parity Check Matrix
        instructions: `
            <ul style="list-style: disc;">
                <li><strong>Step 1:</strong> Read the parameters r and m for the Reed-Muller code.</li>
                <li><strong>Step 2:</strong> For Part 1, analyze the given binary vectors. Select all vectors that <strong>do</strong> belong in the <strong>parity check matrix</strong> of RM(r, m).</li>
                <li><strong>Step 3:</strong> Hint: The rows of the parity check matrix of RM(r, m) are the rows of the generator matrix of its dual code, RM(m-r-1, m). So, you must select vectors with degree at most m-r-1.</li>
                <li><strong>Step 4:</strong> Submit Part 1. If correct, Part 2 will appear.</li>
                <li><strong>Step 5:</strong> For Part 2, select the correct <strong>minimum distance</strong> of the dual code.</li>
            </ul>`,
        part1Title: "Which of the following vectors <strong>do</strong> correspond to a row in the <strong>parity check matrix</strong> of this code?",
        part2Title: "What is the <strong>minimum distance </strong> of the dual code?"
    }
};


// --- Wait for DOM to be fully loaded ---
document.addEventListener('DOMContentLoaded', function () {
    // Detect which experiment is active from the <body> tag
    const exp = parseInt(document.body.dataset.exp || 1);
    
    // Add click event listeners to buttons
    document.getElementById('submitPart1Button').addEventListener('click', checkPart1);
    document.getElementById('submitPart2Button').addEventListener('click', checkPart2);

    document.getElementById('reloadBtn1').addEventListener('click', () => setupProblem(exp));
    document.getElementById('reloadBtn2').addEventListener('click', () => setupProblem(exp));

    // Load the correct experiment
    setupProblem(exp);
});

/**
 * Helper function to pick a random item from an array
 */
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Helper function to pick and remove a random item from an array
 */
const pickAndRemoveRandom = (arr) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1)[0];
};

/**
 * Resets the UI to its initial state before loading a new problem
 */
function resetUI() {
    // Clear feedback
    document.getElementById('observation').innerHTML = '<p>Your feedback will appear here.</p>';
    
    // Hide Part 2
    document.getElementById('part2Question').style.display = 'none';
    document.getElementById('part2ButtonContainer').style.display = 'none';

    // Show Part 1 button
    document.getElementById('part1ButtonContainer').style.display = 'block';

    // Uncheck all inputs
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
}

/**
 * Sets up the randomized problem and updates the UI.
 */
function setupProblem(exp) {
    resetUI();

    problem.activeExperiment = exp;
    problem.m = monomialPool.m;
    
    // Generate r_base randomly from {1, 2, 3}
    problem.r_base = Math.floor(Math.random() * 2) + 1;
    
    let options = []; // This will hold the 4 options for this round

    if (exp === 1) {
        // --- EXPERIMENT 1: GENERATOR MATRIX ---
        problem.r_problem = problem.r_base;
        problem.correctDistance = 2 ** (problem.m - problem.r_problem);

    } else {
        // --- EXPERIMENT 2: PARITY CHECK MATRIX ---
        problem.r_problem = problem.m - problem.r_base - 1;
        // The distance is that of the dual code, RM(r_problem, m)
        problem.correctDistance = 2 ** (problem.m - problem.r_problem);
    }
    
    // --- Build Dynamic Options ---
    // This logic now works for both experiments, using r_problem

    // 1. Add a monomial of degree 'r_problem' (IN the matrix)
    const degR_pool = [...monomialPool.byDegree[problem.r_problem]]; 
    options.push(pickAndRemoveRandom(degR_pool));

    // 2. Add a monomial of degree 'r_problem + 1' (NOT in the matrix)
    const degRPlus1_pool = monomialPool.byDegree[problem.r_problem + 1];
    options.push(pickRandom(degRPlus1_pool));

    // 3. Add a "bad" vector (NOT in the matrix)
    options.push(pickRandom(monomialPool.badVectors));

    // 4. Add another monomial of degree 'r_problem' (IN the matrix)
    options.push(pickRandom(degR_pool)); // Pick from remaining

    // Shuffle the options
    options = options.sort(() => Math.random() - 0.5);

    // --- Map dynamic options to static HTML slots ---
    const html_ids = ['opt-deg1', 'opt-deg2', 'opt-deg3', 'opt-deg4'];
    const span_ids = ['vec1', 'vec2', 'vec3', 'vec4'];
    
    problem.correctMonomialIDs = []; // Store IDs of *correct* rows
    problem.optionMap = {}; // To store what each slot represents

    for (let i = 0; i < 4; i++) {
        const opt = options[i];
        const html_id = html_ids[i];
        const span_id = span_ids[i];

        // Store the mapping
        problem.optionMap[html_id] = opt;

        // Update vector text
        document.getElementById(span_id).textContent = opt.vector;

        // Check if this option is a valid row
        // (Degree is <= r_problem AND is a valid monomial (deg >= 0))
        if (opt.degree <= problem.r_problem && opt.degree >= 0) {
            problem.correctMonomialIDs.push(html_id);
        }
    }

    // --- Update UI Text based on experiment ---
    const rmParamsText = `\\(RM(r=${problem.r_base}, m=${problem.m})\\)`;
    document.getElementById('rmParams').innerHTML = rmParamsText;

    document.getElementById('instructions-content').innerHTML = expContent[exp].instructions;
    document.getElementById('part1QuestionTitle').innerHTML = expContent[exp].part1Title;
    document.getElementById('part2QuestionTitle').innerHTML = expContent[exp].part2Title;
    
    // Typeset any initial MathJax content
    typesetMath();
}

/**
 * Checks Part 1, displays feedback, and reveals Part 2.
 */
function checkPart1() {
    const observationEl = document.getElementById('observation');
    let part1Feedback = '';
    let part1Class = 'feedback-incorrect';

    // Get selected checkbox IDs
    const selectedCheckboxes = document.querySelectorAll('input[name="generator_choice"]:checked');
    const selectedOptions = [];
    selectedCheckboxes.forEach(cb => {
        selectedOptions.push(cb.id);
    });
    
    let isPart1Correct = false;
    let correctIDs = [];
    
    if (problem.activeExperiment === 1) {
        // Exp 1: User should select all vectors NOT in correctMonomialIDs
        const correctAbsentIDs = Object.keys(problem.optionMap)
            .filter(id => !problem.correctMonomialIDs.includes(id));
        isPart1Correct = arrayEquals(selectedOptions, correctAbsentIDs);
        correctIDs = correctAbsentIDs;
    } else {
        // Exp 2: User should select all vectors IN correctMonomialIDs
        isPart1Correct = arrayEquals(selectedOptions, problem.correctMonomialIDs);
        correctIDs = problem.correctMonomialIDs;
    }


    if (isPart1Correct) {
        part1Class = 'feedback-correct';
        part1Feedback = `<strong>Correct!</strong> Your selections are valid. Scroll down for Part 2.`;

        // 1. Show the Question Text
        document.getElementById('part2Question').style.display = 'block';
        
        // 2. Show the Button Container 
        document.getElementById('part2ButtonContainer').style.display = 'flex';
        document.getElementById('submitPart2Button').style.display = 'block';
        
        // 3. Hide the Part 1 Button Container
        document.getElementById('part1ButtonContainer').style.display = 'none';

    } else {
        // MODIFIED FEEDBACK
        if (problem.activeExperiment === 1) {
            part1Feedback = `<strong>Incorrect.</strong> Re-check your selections. Remember, you are looking for vectors that are <strong>NOT</strong> in the generator matrix of \\(RM(${problem.r_base}, 4)\\). (i.e., invalid vectors or degree > ${problem.r_base}).`;
        } else {
            part1Feedback = `<strong>Incorrect.</strong> Re-check your selections. Remember, you are looking for vectors that <strong>ARE</strong> in the parity check matrix of \\(RM(${problem.r_base}, 4)\\). (Hint: These are the generator rows of \\(RM(${problem.r_problem}, 4)\\), so you need valid vectors with degree at most\( ${problem.r_problem}\)).`;
        }
        
        // --- Ensure Part 2 remains hidden ---
        document.getElementById('part2Question').style.display = 'none';
        document.getElementById('submitPart2Button').style.display = 'none';
    }

    // --- Display Feedback for Part 1 ---
    observationEl.innerHTML = `
        <h4 style="margin-bottom: 0.5rem;">Part 1 Feedback:</h4>
        <p class="${part1Class}">${part1Feedback}</p>
        <div id="part2FeedbackArea"></div>
    `;
    
    // Re-run MathJax to typeset the feedback
    typesetMath();
}

/**
 * Checks Part 2 and displays its feedback.
 */
function checkPart2() {
    const part2FeedbackArea = document.getElementById('part2FeedbackArea');
    let part2Feedback = '';
    let part2Class = 'feedback-incorrect';

    const selectedRadio = document.querySelector('input[name="distance_choice"]:checked');
    
    if (selectedRadio) {
        const selectedDistance = parseInt(selectedRadio.value);
        if (selectedDistance === problem.correctDistance) {
            part2Class = 'feedback-correct';
            if (problem.activeExperiment === 1) {
                part2Feedback = `<strong>Correct!</strong> The minimum distance \\(d\\) of \\(RM(r, m)\\) is \\(d = 2^{m-r}\\). For this code, \\(d = 2^{${problem.m}-${problem.r_base}} = ${problem.correctDistance}\\).`;
            } else {
                 part2Feedback = `<strong>Correct!</strong> The dual code is \\(RM(${problem.r_problem}, m)\\). Its minimum distance is \\(d^\\perp = 2^{m-r'}\\) = \\(2^{${problem.m}-${problem.r_problem}} = ${problem.correctDistance}\\).`;
            }
        } else {
            // MODIFIED FEEDBACK
            if (problem.activeExperiment === 1) {
                part2Feedback = `<strong>Incorrect.</strong> That is not the correct distance. Recall the formula for the minimum distance \\(d\\) of an \\(RM(r, m)\\) code and apply it to \\(RM(${problem.r_base}, ${problem.m})\\).`;
            } else {
                 part2Feedback = `<strong>Incorrect.</strong> That is not the correct distance. Recall that the dual code is \\(RM(r', m)\\) where \\(r' = m-r-1 = ${problem.r_problem}\\). Find the minimum distance for *that* code.`;
            }
        }
    } else {
        part2Feedback = 'Please select an option for the minimum distance.';
    }

    // --- Display Feedback for Part 2 ---
    part2FeedbackArea.innerHTML = `
        <br>
        <h4 style="margin-bottom: 0.5rem;">Part 2 Feedback:</h4>
        <p class="${part2Class}">${part2Feedback}</p>
    `;

    // Re-run MathJax to typeset the new feedback
    typesetMath();
}

/**
 * Helper function to typeset MathJax content
 */
function typesetMath() {
    if (window.MathJax) {
        window.MathJax.typesetPromise()
            .catch((err) => {
                console.log('MathJax encountered an error during typesetting:', err);
            });
    } else {
        console.log('MathJax is not loaded');
    }
}

/**
 * Helper function to compare two arrays, ignoring order.
 */
function arrayEquals(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    
    for (let i = 0; i < sortedA.length; i++) {
        if (sortedA[i] !== sortedB[i]) {
            return false;
        }
    }
    return true;
}