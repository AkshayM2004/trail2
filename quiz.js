// Questions stored directly in JavaScript
const questions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Paris", "Madrid", "Rome"],
        answer: 1
    },
    {
        question: "Which is the largest planet in the Solar System?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: 2
    },
    {
        question: "What is 5 + 7?",
        options: ["10", "11", "12", "13"],
        answer: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;
let quizPaused = false;
let timeLeft = 60; // 60 seconds for demo
let interval;

// Ensure quiz starts only if allowed
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("quizStarted")) {
        window.location.href = "index.html"; // Redirect if password not entered
    }
    checkInternetBeforeStart();
});

// Function to check internet before starting the quiz
function checkInternetBeforeStart() {
    if (navigator.onLine) {
        alert("Please TURN OFF the internet before starting the quiz!");
        setTimeout(checkInternetBeforeStart, 1000);
    } else {
        startQuiz();
    }
}

// Function to start the quiz
function startQuiz() {
    quizPaused = false;
    document.getElementById("pauseScreen").classList.add("hide");
    document.getElementById("quizContainer").classList.remove("hide");
    startTimer();
    loadQuestion();
}

// Function to load a question
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").textContent = questionData.question;

    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";
    questionData.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.classList.add("answer-btn");
        btn.onclick = () => checkAnswer(index);
        answersDiv.appendChild(btn);
    });
}

// Function to check the answer
function checkAnswer(selectedIndex) {
    if (questions[currentQuestionIndex].answer === selectedIndex) {
        score++;
    }
    currentQuestionIndex++;
    loadQuestion();
}

// Function to start the timer
function startTimer() {
    clearInterval(interval); // Clear any existing timer
    interval = setInterval(() => {
        if (!quizPaused) {
            document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(interval);
                alert("Time's up! Submitting quiz...");
                showResults();
            }
        }
    }, 1000);
}

// Function to show quiz results
function showResults() {
    clearInterval(interval);
    document.getElementById("quizContainer").classList.add("hide");
    document.getElementById("resultScreen").classList.remove("hide");
    document.getElementById("finalScore").textContent = `Your Score: ${score} / ${questions.length}`;
}

// Function to pause the quiz
function pauseQuiz() {
    quizPaused = true;
    document.getElementById("quizContainer").classList.add("hide");
    document.getElementById("pauseScreen").classList.remove("hide");
    clearInterval(interval);
}

// Function to resume quiz with password & internet check
function resumeQuiz() {
    let inputPassword = document.getElementById("resumePassword").value;

    if (navigator.onLine) {
        alert("Internet is still ON! Turn OFF the internet before resuming.");
        return;
    }

    if (inputPassword === "1234") {
        alert("Correct password! Resuming quiz...");
        startQuiz();
    } else {
        alert("Incorrect password! Try again.");
        pauseQuiz();
    }
}

// Detect tab switching
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        pauseQuiz();
    }
});

// Detect internet reconnection
window.addEventListener("online", () => {
    alert("Internet detected! Quiz paused.");
    pauseQuiz();
});

// Resume button event
document.getElementById("resumeBtn").addEventListener("click", resumeQuiz);
