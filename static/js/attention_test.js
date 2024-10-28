const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const targetLetter = document.getElementById('target-letter');
const grid = document.getElementById('letter-grid');
const scoreDisplay = document.getElementById('score-display');
const totalRounds = 5; // Set total rounds for the test
let currentRound = 0;
let correctAnswers = 0;
let startTime;
let roundStartTime;

// Generate random letters for the current round
function generateRandomLetters() {
    const randomLetters = Array.from({ length: 36 }, () =>
        letters[Math.floor(Math.random() * letters.length)]
    );
    const correctPosition = Math.floor(Math.random() * 36);
    randomLetters[correctPosition] = targetLetter.textContent; // Ensure the target letter is included
    return randomLetters;
}

// Render the current round
function renderRound() {
    if (currentRound < totalRounds) {
        // Generate a new target letter
        targetLetter.textContent = letters[Math.floor(Math.random() * letters.length)];
        const randomLetters = generateRandomLetters();
        grid.innerHTML = ''; // Clear previous grid

        randomLetters.forEach(letter => {
            const div = document.createElement('div');
            div.classList.add('grid-item');
            div.textContent = letter;
            div.addEventListener('click', () => handleAnswer(div)); // Attach the click event
            grid.appendChild(div);
        });

        // Set the start time for the round
        roundStartTime = new Date().getTime();
    } else {
        finishTest(); // Finish the test if all rounds are completed
    }
}

// Handle the user's answer
function handleAnswer(selectedDiv) {
    const userAnswer = selectedDiv.textContent;
    const correctAnswer = targetLetter.textContent;
    const result = userAnswer === correctAnswer ? 'Correct' : 'Incorrect';

    if (result === 'Correct') {
        correctAnswers++;
    }

    // Calculate time taken for this round
    const roundEndTime = new Date().getTime();
    const timeTakenForRound = roundEndTime - roundStartTime; // Time taken for this round

    // Send the result to the Flask backend
    fetch('/save_result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            test_type: 'Attention',
            user_answer: userAnswer,
            correct_answer: correctAnswer,
            result: result,
            time_taken: timeTakenForRound, // Time taken for this round
            correct_attempts: correctAnswers,
            incorrect_attempts: currentRound - correctAnswers
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        currentRound++; // Increment current round here
        scoreDisplay.textContent = `Score: ${correctAnswers} / ${currentRound}`; // Update score display
        setTimeout(renderRound, 1000); // Automatically render the next round after 1 second
    })
    .catch(error => console.error('Error:', error));

    displayResult(result); // Show result message
}

// Display the result message
function displayResult(result) {
    const message = document.createElement('div');
    message.className = 'result-message';
    message.textContent = result;

    // Style the message based on the result
    message.style.position = 'absolute';
    message.style.top = '20px'; // Position it at the top
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.color = '#fff';
    message.style.fontSize = '20px';
    message.style.zIndex = '1000'; // Ensure it's on top
    message.style.transition = 'opacity 0.5s ease'; // Smooth transition

    message.style.backgroundColor = result === 'Correct' ? 'green' : 'red'; // Set background color

    document.body.appendChild(message);

    // Fade out and remove the message after 1 second
    setTimeout(() => {
        message.style.opacity = '0'; // Fade out
        setTimeout(() => {
            document.body.removeChild(message); // Remove from DOM
        }, 500); // Wait for fade out to complete before removal
    }, 1000); // Show for 1 second
}

// Finish the test and display results
function finishTest() {
    const endTime = new Date().getTime();
    const totalTimeTaken = (endTime - startTime) / 1000; // Total time in seconds
    const percentageScore = (correctAnswers / totalRounds) * 100; // Calculate percentage score

    alert(`Test Complete! Your score is ${percentageScore.toFixed(2)}%. Total time taken: ${totalTimeTaken.toFixed(2)} seconds.`);

    // Calculate attentiveness
    const attentiveness = (percentageScore / totalTimeTaken * 100).toFixed(2); // Simple formula for attentiveness

    alert(`Your attentiveness score is: ${attentiveness}%`);

    // Store results in the database
    fetch('/save_result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            test_type: 'Attention',
            user_answer: null,  // No user answer for final results
            correct_answer: null,  // No correct answer for final results
            result: null,  // No result for final submission
            time_taken: totalTimeTaken, // Use total time taken
            correct_attempts: correctAnswers,
            incorrect_attempts: totalRounds - correctAnswers,
            percentage_score: percentageScore, // Include the percentage score
            attentiveness_score: attentiveness // Include the attentiveness score
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Optionally, redirect to the next test (e.g., memory test)
        window.location.href = '/memory_test'; // Redirect to memory test or wherever you want
    })
    .catch(error => console.error('Error:', error));
}

// Start the timer and the first round
startTime = new Date().getTime();
renderRound(); // Start the first round
