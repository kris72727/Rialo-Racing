// --- Game State Variables ---
let score = 0;
let timeLeft = 60;
let timerInterval;
let currentQuestionIndex = 0;
let gameStarted = false;

// --- DOM Elements ---
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const startButton = document.getElementById('start-button');
const feedbackText = document.getElementById('feedback');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');

// --- Game Questions (Data) ---
const questions = [
    {
        question: "Rialo Chain is designed to natively access what type of data without external oracles?",
        answers: ["Off-chain/Real-world data", "Legacy Blockchain data", "Only ERC-20 token lists", "Encrypted side-chain data"],
        correct: "Off-chain/Real-world data"
    },
    {
        question: "What smart contract language is typically associated with the Move Object Model?",
        answers: ["Solidity", "Rust/Move", "Python", "Java"],
        correct: "Rust/Move"
    },
    {
        question: "In the 'Finality Lap' game, what feature allows a car's speed to change based on real-time stock prices?",
        answers: ["Move Object Composition", "Native Web Calls", "Token Gating", "Decentralized Liquidity"],
        correct: "Native Web Calls"
    },
    {
        question: "Which file handles the game's logic and interactivity?",
        answers: ["style.css", "index.html", "script.js", "README.md"],
        correct: "script.js"
    },
    {
        question: "How are unique assets like the 'Rain Tires' and 'The Brute' represented on a Web3 chain?",
        answers: ["Fungible Tokens (FTs)", "Non-Fungible Tokens (NFTs)", "JSON Arrays", "Plain Objects"],
        correct: "Non-Fungible Tokens (NFTs)"
    }
];

// --- Core Game Functions ---

/
 * Starts the game, timer, and loads the first question.
 */
function startGame() {
    if (gameStarted) return; // Prevent multiple starts

    gameStarted = true;
    score = 0;
    timeLeft = 60;
    currentQuestionIndex = 0;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    startButton.style.display = 'none';
    feedbackText.textContent = '';
    
    // Shuffle questions for variety
    questions.sort(() => Math.random() - 0.5);

    startTimer();
    loadQuestion();
}

/
 * Starts and manages the countdown timer.
 */
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame('Time is up!');
        }
    }, 1000);
}

/
 * Loads the next question or ends the game if questions run out.
 */
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame('All questions answered!');
        return;
    }

    const q = questions[currentQuestionIndex];
    questionText.textContent = q.question;
    answersContainer.innerHTML = '';
    
    // Create answer buttons
    q.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-button');
        button.onclick = () => checkAnswer(answer, q.correct, button);
        answersContainer.appendChild(button);
    });
}

/
 * Checks the user's answer and updates the score/feedback.
 * @param {string} selectedAnswer - The text of the button clicked.
 * @param {string} correctAnswer - The correct answer for the current question.
 * @param {HTMLElement} button - The button element clicked.
 */
function checkAnswer(selectedAnswer, correctAnswer, button) {
    // Disable all buttons after one is clicked
    Array.from(answersContainer.children).forEach(btn => btn.disabled = true);
if (selectedAnswer === correctAnswer) {
        score += 10; // 10 points for a correct answer (A boost!)
        scoreDisplay.textContent = score;
        button.classList.add('correct');
        feedbackText.textContent = 'Correct! Gaining speed... (+10 Points)';
    } else {
        timeLeft -= 5; // 5 second penalty (A minor crash!)
        timerDisplay.textContent = timeLeft;
        button.classList.add('incorrect');
        feedbackText.textContent = Incorrect! Lost 5 seconds. The correct answer was: ${correctAnswer};
        // Highlight the correct answer
        Array.from(answersContainer.children)
            .find(btn => btn.textContent === correctAnswer)
            .classList.add('correct');
    }

    // Move to the next question after a brief delay
    setTimeout(() => {
        currentQuestionIndex++;
        feedbackText.textContent = '';
        if (timeLeft > 0) {
            loadQuestion();
        } else {
            endGame('Time has run out!');
        }
    }, 2000);
}

/**
 * Ends the game and displays the final score modal.
 * @param {string} reason - The reason the game ended.
 */
function endGame(reason) {
    clearInterval(timerInterval);
    gameStarted = false;
    
    // Remove buttons and display final message
    answersContainer.innerHTML = '';
    questionText.textContent = reason;
    startButton.style.display = 'block';
    startButton.textContent = 'RACE OVER';
    
    // Show modal
    modalMessage.innerHTML = Your Final Score is: <strong>${score}</strong>.<br><br>The race is finished!;
    modal.style.display = 'block';
}
