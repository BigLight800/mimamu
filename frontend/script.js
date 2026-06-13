const API_BASE = 'http://localhost:8080/api/puzzle';

let puzzleId = null;
let storageKey = null;
let imagePath = null;

let lengths = [];
const guessedWords = [];
const displayWords = [];

const imageElement = document.getElementById("game-image");
const sentenceContainer = document.getElementById("sentence-container");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const guessArea = document.querySelector(".guess-area");
const message = document.getElementById("message");

async function loadPuzzle() {
    try {
        const response = await fetch(`${API_BASE}/current`);
        const puzzle = await response.json();

        puzzleId = puzzle.id;
        storageKey = `mimamu_${puzzleId}`;
        imagePath = puzzle.imagePath;
        lengths = puzzle.lengths;

        const BACKEND_URL = "http://localhost:8080";
        imageElement.src = BACKEND_URL + imagePath;

        guessedWords.length = lengths.length;
        displayWords.length = lengths.length;
        guessedWords.fill(false);
        displayWords.fill("");

        loadGame();
        renderSentence();
        checkWin();
    } catch (error) {
        message.textContent = "Failed to load puzzle. Is the backend running?";
        console.error("Failed to load puzzle:", error);
    }
}

function renderSentence() {
    sentenceContainer.innerHTML = "";

    for (let i = 0; i < lengths.length; i++) {
        if (guessedWords[i]) {
            const solvedWord = document.createElement("span");

            solvedWord.classList.add("solved-word");
            solvedWord.textContent = displayWords[i];
            sentenceContainer.appendChild(solvedWord);
        } else {
            const wordBox = document.createElement("div");

            wordBox.classList.add("word-box");
            wordBox.style.width = (lengths[i] * 20) + "px";
            wordBox.textContent = lengths[i];
            sentenceContainer.appendChild(wordBox);
        }
    }
}

async function guessWord() {
    const userGuess = guessInput.value;

    if (userGuess === "") {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${puzzleId}/guess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guess: userGuess })
        });

        const result = await response.json();

        if (result.matchedIndexes && result.matchedIndexes.length > 0) {
            for (const index of result.matchedIndexes) {
                guessedWords[index] = true;
                displayWords[index] = result.displayWord;
            }
        }

        guessInput.value = "";

        renderSentence();
        checkWin();
        saveGame();
    } catch (error) {
        console.error("Guess failed:", error);
    }
}

function checkWin() {
    if (!guessedWords.includes(false)) {
        guessArea.style.display = "none";
        message.textContent = "You solved it!";
    }
}

guessButton.addEventListener("click", guessWord);

guessInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        guessWord();
    }
});

function saveGame() {
    const gameState = {
        guessedWords: guessedWords,
        displayWords: displayWords
    };

    localStorage.setItem(storageKey, JSON.stringify(gameState));
}

function loadGame() {
    const savedState = localStorage.getItem(storageKey);

    if (savedState === null) {
        return;
    }

    const gameState = JSON.parse(savedState);

    for (let i = 0; i < guessedWords.length; i++) {
        guessedWords[i] = gameState.guessedWords[i];
        displayWords[i] = gameState.displayWords[i];
    }
}

loadPuzzle();
