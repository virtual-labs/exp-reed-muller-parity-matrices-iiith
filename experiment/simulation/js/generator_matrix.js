// --- Global problem state ---
let problem = {};

// --- Pool of available monomials and bad vectors for m=4 ---
const monomialPool = {
    m: 4,
    badVectors: [
        { id: 'bad1', degree: -1, vector: '(1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0)' },
        { id: 'bad2', degree: -1, vector: '(1,1,1,1, 0,0,0,0, 0,0,0,0, 0,0,0,0)' }
    ],
    byDegree: {
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

// --- Wait for DOM to be fully loaded ---
document.addEventListener('DOMContentLoaded', function () {
    setupProblem();

    // Add click event listeners
    document.getElementById('submitPart1Button').addEventListener('click', checkPart1);
    document.getElementById('submitPart2Button').addEventListener('click', checkPart2);
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
 * Sets up the randomized problem and updates the UI.
 */
function setupProblem() {
    problem.m = monomialPool.m;
    // Generate r randomly from {1, 2, 3}
    problem.r = Math.floor(Math.random() * 3) + 1; 
    
    let options = []; // This will hold the 4 options for this round

    // 1. Add a monomial of degree 'r' (distractor, IN matrix)
    const degR_pool = [...monomialPool.byDegree[problem.r]]; // Make a copy
    options.push(pickAndRemoveRandom(degR_pool));

    // 2. Add a monomial of degree 'r+1' (correct, NOT in matrix)
    const degRPlus1_pool = monomialPool.byDegree[problem.r + 1];
    options.push(pickRandom(degRPlus1_pool));

    // 3. Add a "bad" vector (correct, NOT in matrix)
    options.push(pickRandom(monomialPool.badVectors));

    // 4. Add another monomial of degree 'r' (distractor, IN matrix)
    options.push(pickRandom(degR_pool)); // Pick from remaining

    // Shuffle the options
    options = options.sort(() => Math.random() - 0.5);

    // --- Map dynamic options to static HTML slots ---
    const html_ids = ['opt-deg1', 'opt-deg2', 'opt-deg3', 'opt-deg4'];
    const span_ids = ['vec1', 'vec2', 'vec3', 'vec4'];
    
    problem.correctAbsentMonomialIDs = [];
    problem.optionMap = {}; // To store what each slot represents

    for (let i = 0; i < 4; i++) {
        const opt = options[i];
        const html_id = html_ids[i];
        const span_id = span_ids[i];

        // Store the mapping
        problem.optionMap[html_id] = opt;

        // Update vector text
        document.getElementById(span_id).textContent = opt.vector;

        // Check if this option is a correct one to select
        // (Degree is > r OR degree is invalid < 0)
        if (opt.degree > problem.r || opt.degree < 0) {
            problem.correctAbsentMonomialIDs.push(html_id);
        }
    }

    // --- Update UI Text and Part 2 Answer ---
    const rmParamsText = `\\(RM(r=${problem.r}, m=${problem.m})\\)`;
    document.getElementById('rmParams').innerHTML = rmParamsText;
    document.getElementById('rmParamsPart2').innerHTML = `\\(RM(${problem.r}, ${problem.m})\\)`;

    problem.correctDistance = 2 ** (problem.m - problem.r);
    
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

    // Check if the selected array matches the correct array
    const isPart1Correct = arrayEquals(selectedOptions, problem.correctAbsentMonomialIDs);

    if (isPart1Correct) {
        part1Class = 'feedback-correct';
        part1Feedback = `<strong>Correct!</strong> The generator matrix for \\(RM(r, m)\\) contains rows for valid monomials of degree <strong>at most</strong> \\(r\\). Since \\(r=${problem.r}\\), all vectors from monomials with degree > ${problem.r} (and any invalid vectors) are correctly excluded.`;

        // --- Show Part 2 ONLY IF Part 1 is correct ---
        document.getElementById('part2Question').style.display = 'block';
        document.getElementById('submitPart2Button').style.display = 'block';
        
        // Hide Part 1 button
        document.getElementById('submitPart1Button').style.display = 'none';

    } else {
        // MODIFIED FEEDBACK
        part1Feedback = `<strong>Incorrect.</strong> Re-check your selections. Remember that the generator matrix for \\(RM(r, m)\\) only contains rows for valid monomials with a degree <strong>at most</strong> \\(r=${problem.r}\\). Your task is to select all vectors that <strong>do not</strong> meet this criteria.`;
        
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
            part2Feedback = `<strong>Correct!</strong> The minimum distance \\(d\\) of a non-trivial \\(RM(r, m)\\) code is \\(d = 2^{m-r}\\). For this code, \\(d = 2^{${problem.m}-${problem.r}} = 2^${problem.m - problem.r} = ${problem.correctDistance}\\). Continue to the next part.`;
        } else {
            // MODIFIED FEEDBACK
            part2Feedback = `<strong>Incorrect.</strong> That is not the correct distance. Recall the formula for the minimum distance \\(d\\) of an \\(RM(r, m)\\) code and apply it to the given parameters \\(r=${problem.r}\\) and \\(m=${problem.m}\\).`;
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