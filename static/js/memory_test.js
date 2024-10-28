// Initialize variables for tracking test data
let currentSequenceIndex = 0;
let selectedAnswer = [];
let startTime, endTime;
let correctAttempts = 0;
let incorrectAttempts = 0;

// Define the sequences to be tested
const sequences = [
    { type: 'shapes', value: generateRandomShapes(5) }, // Shapes sequence
    { type: 'letters', value: generateRandomLetters(5) }, // Letters sequence
    { type: 'numbers', value: generateRandomNumbers(5) }, // Numbers sequence
    { type: 'colors', value: generateRandomColors(5) } // Colors sequence
];

// Event listeners for starting the test and submitting answers
document.getElementById('start-test-btn').addEventListener('click', startTest);
document.getElementById('submit-answer-btn').addEventListener('click', checkAnswer);

// Function to start the test
function startTest() {
    if (currentSequenceIndex < sequences.length) {
        startTime = Date.now(); // Start timer
        showSequence(sequences[currentSequenceIndex].value);
    } else {
        // Show final result and redirect to the next test
        showFinalResult();
        setTimeout(() => {
            window.location.href = '/reading_test'; // Navigate to the next test if all sequences are done
        }, 2000);
    }
}

// Function to display the sequence to the user
function showSequence(sequence) {
    document.getElementById('letter-sequence').innerText = sequence;
    document.getElementById('start-test-btn').style.display = 'none';

    // Hide the sequence after 3 seconds and show the answer section
    setTimeout(() => {
        document.getElementById('letter-sequence').innerText = '';
        if (sequences[currentSequenceIndex].type === 'shapes') {
            displayShapeOptions(); // Show shape options for shapes
        } else {
            // For letters, numbers, and colors, we just need to collect input directly
            document.getElementById('answer-section').style.display = 'block';
            document.getElementById('input-box').style.display = 'block'; // Show input box
        }
    }, 3000); // Display sequence for 3 seconds
}

// Function to display clickable shape options for the user to select
function displayShapeOptions() {
    const shapes = ['🔴', '🟢', '🔵', '🟡', '🟠', '🟣'];
    const shapeOptionsContainer = document.getElementById('shape-options');
    shapeOptionsContainer.innerHTML = ''; // Clear previous options

    // Create a button for each shape
    shapes.forEach(shape => {
        const shapeButton = document.createElement('button');
        shapeButton.textContent = shape;
        shapeButton.style.fontSize = '30px';
        shapeButton.style.margin = '5px';
        shapeButton.onclick = () => selectShape(shape); // Add onclick event
        shapeOptionsContainer.appendChild(shapeButton);
    });

    // Show the answer section for shape selection
    document.getElementById('answer-section').style.display = 'block';
    document.getElementById('shape-selection-message').innerText = 'Select the shapes in the correct order:'; // Display message
}

// Function to track and display user's selected shapes
function selectShape(shape) {
    selectedAnswer.push(shape); // Add selected shape to the answer array

    // Display the selected shapes to the user
    const selectedShapesContainer = document.getElementById('selected-shapes');
    selectedShapesContainer.innerText = selectedAnswer.join(' '); // Show in order
}

// Function to check if the user's answer is correct
function checkAnswer() {
    const correctAnswer = sequences[currentSequenceIndex].value;
    const resultElement = document.getElementById('result');

    // Check if user answered correctly
    if (sequences[currentSequenceIndex].type === 'shapes') {
        if (selectedAnswer.join('') === correctAnswer) {
            correctAttempts++;
            showResult('Correct!');
        } else {
            incorrectAttempts++;
            showResult(`Incorrect! The correct sequence was: ${correctAnswer}`);
        }
    } else {
        const userAnswer = document.getElementById('input-box').value.trim();
        if (userAnswer === correctAnswer) {
            correctAttempts++;
            showResult('Correct!');
        } else {
            incorrectAttempts++;
            showResult(`Incorrect! The correct sequence was: ${correctAnswer}`);
        }
    }

    // Save result to the database
    saveResult(selectedAnswer.join(''), correctAnswer);

    // Clear input and selected answers for the next test
    if (sequences[currentSequenceIndex].type === 'shapes') {
        selectedAnswer = []; // Reset for the next test
        document.getElementById('shape-options').innerHTML = ''; // Clear shape options
        document.getElementById('selected-shapes').innerText = ''; // Clear selected shapes display
        document.getElementById('shape-selection-message').innerText = ''; // Clear selection message
    } else {
        document.getElementById('input-box').value = ''; // Reset input for the next test
    }

    currentSequenceIndex++; // Move to the next sequence
    setTimeout(() => startTest(), 2000); // Automatically proceed to the next test after 2 seconds
}

// Function to show result temporarily
function showResult(message) {
    const resultElement = document.getElementById('result');
    resultElement.innerText = message;
    resultElement.style.display = 'block';

    setTimeout(() => {
        resultElement.style.display = 'none';
    }, 2000); // Display message for 2 seconds
}

// Function to save the result to the database
function saveResult(userAnswer, correctAnswer) {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds

    const data = {
        test_type: 'Memory',
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        time_taken: timeTaken,
        correct_attempts: correctAttempts,
        incorrect_attempts: incorrectAttempts,
    };

    fetch('/save_result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch((error) => console.error('Error:', error));
}

// Function to generate random unique shapes
function generateRandomShapes(length) {
    const shapes = ['🔴', '🟢', '🔵', '🟡', '🟠', '🟣'];
    
    // Shuffle the shapes array and slice to the required length
    const shuffledShapes = shapes.sort(() => 0.5 - Math.random());
    return shuffledShapes.slice(0, length).join(''); // Join to create the sequence
}

// Function to generate random letters
function generateRandomLetters(length) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
}

// Function to generate random numbers
function generateRandomNumbers(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10); // Random digit between 0-9
    }
    return result;
}

// Function to generate random colors
function generateRandomColors(length) {
    const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple'];
    const shuffledColors = colors.sort(() => 0.5 - Math.random());
    return shuffledColors.slice(0, length).join(', '); // Join to create the sequence
}

// Function to fetch and display performance after completing the memory test
function fetchAndDisplayPerformance() {
    fetch('/calculate_performance')
    .then(response => response.json())
    .then(data => {
        alert(`Your Score: ${data.score}%\nTotal Correct: ${data.total_correct}\nTotal Incorrect: ${data.total_incorrect}\nMemory Capacity: ${data.memory_capacity}%`);
    })
    .catch((error) => console.error('Error fetching performance data:', error));
}

// Call this function when the user completes all tests
function showFinalResult() {
    alert('You have completed all tests! Thank you for participating.');
    fetchAndDisplayPerformance(); // Fetch and display the performance
}
