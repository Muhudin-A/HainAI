const scrambledText = "The qciuk brown fox jmups over the alyz dog.";
const correctText = "The quick brown fox jumps over the lazy dog.";

const userAnswerTextarea = document.getElementById('user-answer');
const submitAnswerButton = document.getElementById('submit-answer');
const feedbackDiv = document.getElementById('feedback');
const nextTestDiv = document.getElementById('next-test');

// Track attempts and time
let correctAttempts = 0;
let incorrectAttempts = 0;
let startTime;
let endTime;

// Current indices for tests
let currentWordIndex = 0;
let currentSentenceIndex = 0;

// Set up the reading test
window.onload = function() {
    startTime = new Date();
    document.getElementById('scrambled-text').innerText = scrambledText;
};

// Handle reading test submission
submitAnswerButton.addEventListener('click', handleReadingTestSubmission);

function handleReadingTestSubmission() {
    const userAnswer = userAnswerTextarea.value.trim();
    endTime = new Date();

    // Validate input
    if (!userAnswer) {
        displayFeedback("Please enter a sentence before submitting.");
        return;
    }

    const isCorrect = userAnswer === correctText;

    // Update attempts and feedback
    if (isCorrect) {
        correctAttempts++;
        displayFeedback("Well done! That's correct.", true);
    } else {
        incorrectAttempts++;
        displayFeedback("Oops! That's incorrect. Try again.");
    }

    // Send result to the server
    sendResultToServer(userAnswer, isCorrect);
}

// Function to display feedback messages
function displayFeedback(message, isCorrect = false) {
    feedbackDiv.innerText = message;

    if (isCorrect) {
        submitAnswerButton.style.display = 'none'; // Hide button on correct answer
        nextTestDiv.style.display = 'block'; // Show next test section
        nextTestDiv.innerHTML = `<button id="start-word-recognition">Start Word Recognition Test</button>`;

        document.getElementById('start-word-recognition').addEventListener('click', startWordRecognitionTest); // Start word recognition test on button click
    }
}

function sendResultToServer(userAnswer, isCorrect) {
    const timeTaken = Math.round((endTime - startTime) / 1000);
    
    fetch('/save_reading_result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            test_type: 'reading',  // Update this to match your actual endpoint
            user_answer: userAnswer,
            correct_answer: correctText,
            time_taken: timeTaken,
            correct_attempts: correctAttempts,
            incorrect_attempts: incorrectAttempts
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        if (isCorrect) {
            // Start the word recognition test when the answer is correct
            startWordRecognitionTest();
        }
    })
    .catch(error => {
        displayFeedback("An error occurred while saving the result. Please try again.");
        console.error('Error:', error);
    });
}

// Word Recognition Test
const words = [
    "Apple", 
    "Banana", 
    "Grapes", 
    "Orange", 
    "Strawberry", 
    "Watermelon", 
    "Pineapple", 
    "Blackberry", 
    "Cantaloupe", 
    "Tangerine"
];

// Start Word Recognition Test
function startWordRecognitionTest() {
    nextTestDiv.style.display = 'none'; // Hide the next test button
    currentWordIndex = 0; // Reset word index
    displayNextWord(); // Show the first word
}

// Function to display the next word
function displayNextWord() {
    if (currentWordIndex < words.length) {
        const wordToRecognize = words[currentWordIndex];
        nextTestDiv.innerHTML = `
            <h3>Word Recognition Test</h3>
            <p>What is this word? <strong>${wordToRecognize}</strong></p>
            <textarea id="word-recognition-answer" placeholder="Type the word here"></textarea>
            <button id="submit-word">Submit</button>
        `;

        // Attach event listener for the word submission
        document.getElementById('submit-word').onclick = checkWordRecognition;
        nextTestDiv.style.display = 'block'; // Show the test
    } else {
        // After all words have been attempted, move to the next test
        displayNextSentence(); 
    }
}

// Check user's answer in the word recognition test
function checkWordRecognition() {
    const userAnswer = document.getElementById('word-recognition-answer').value.trim();

    if (!userAnswer) {
        alert("Please enter a word before submitting.");
        return;
    }

    const correctWord = words[currentWordIndex];
    if (userAnswer.toLowerCase() === correctWord.toLowerCase()) {
        correctAttempts++;
        currentWordIndex++;
        displayNextWord(); // Proceed to the next word
    } else {
        incorrectAttempts++;
        alert("Incorrect. Try again.");
    }
}

// Function to display the next sentence
function displayNextSentence() {
    const sentences = [
        "The cat sat on the mat.", 
        "Birds can fly high in the sky.", 
        "The sun sets in the west.", 
        "A journey of a thousand miles begins with a single step.", 
        "To be or not to be, that is the question."
    ];

    if (currentSentenceIndex < sentences.length) {
        const sentenceToRecognize = sentences[currentSentenceIndex];
        nextTestDiv.innerHTML = `
            <h3>Sentence Recognition Test</h3>
            <p>What is this sentence? <strong>${sentenceToRecognize}</strong></p>
            <textarea id="sentence-recognition-answer" placeholder="Type the sentence here"></textarea>
            <button id="submit-sentence">Submit</button>
        `;

        // Attach event listener for the sentence submission
        document.getElementById('submit-sentence').onclick = checkSentenceRecognition;
        nextTestDiv.style.display = 'block'; // Show the test
    } else {
        nextTestDiv.innerHTML = "<h3>All tests have been completed!</h3><p>Thank you for participating!</p>";
        fetchAndDisplayPerformance();
    }
}

// Check user's answer in the sentence recognition test
function checkSentenceRecognition() {
    const userAnswer = document.getElementById('sentence-recognition-answer').value.trim();

    if (!userAnswer) {
        alert("Please enter a sentence before submitting.");
        return;
    }

    const sentences = [
        "The cat sat on the mat.", 
        "Birds can fly high in the sky.", 
        "The sun sets in the west.", 
        "A journey of a thousand miles begins with a single step.", 
        "To be or not to be, that is the question."
    ];

    const correctSentence = sentences[currentSentenceIndex];
    if (userAnswer.toLowerCase() === correctSentence.toLowerCase()) {
        correctAttempts++;
        currentSentenceIndex++;
        displayNextSentence(); // Proceed to the next sentence
    } else {
        incorrectAttempts++;
        alert("Incorrect. Try again.");
    }
}

// Function to fetch and display performance after completing all tests
function fetchAndDisplayPerformance() {
    fetch('/calculate_performance')
    .then(response => response.json())
    .then(data => {
        alert(`Your Score: ${data.score}%\nTotal Correct: ${data.total_correct}\nTotal Incorrect: ${data.total_incorrect}\nMemory Capacity: ${data.memory_capacity}%`);
        // Show the Finished button after displaying performance
        document.getElementById('go-to-dyslexia_assessment').style.display = 'block'; // Show the Finished button
    })
    .catch((error) => console.error('Error fetching performance data:', error));
}
