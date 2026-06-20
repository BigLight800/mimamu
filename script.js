const puzzleId = "image_5"
const storageKey = `mimamu_${puzzleId}`;
const imagePath = "images/image5.png";

const words = ['559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd', '47c5c28cae2574cdf5a194fe7717de68f8276f4bf83e653830925056aeb32a48', '178a482cd604ea4f2bb86441a78b8155b3c521ca83aa00cb8de5a0b36038c24c', 'ea325d761f98c6b73320e442b67f2a3574d9924716d788ddc0dbbdcaca853fe7', '4707c4fdc04e69db4efde7e7e13366cca19c7b7d06610a9beeb0bf4067904a29', '4707c4fdc04e69db4efde7e7e13366cca19c7b7d06610a9beeb0bf4067904a29', '2bd8bb43437e431605b29097eca726ec1dc79a64d6dafeab1d8c0009a93de1d4', '224ec67c8947961173b43122f0b4e387052be28030332330e78df631b342d48e', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '0b132ea2f6cd37dd630da9e84733f169a4473feaebbfa70359b449b759885ffe', 'a7cdf5d0586b392473dd0cd08c9ba833240006a8a7310bf9bc8bf1aefdfaeadb', '6201111b83a0cb5b0922cb37cc442b9a40e24e3b1ce100a4bb204f4c63fd2ac0', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'c31b01d0933056e1af522572b6988e0b102137921daf3345e5e588a943e148dd', 'aba4cc9b8af82df5d4efaade764d6a77466453f3e4156bb0b4e489710516b1c3', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '4c448a406dcdf064f72628200461936808f1d5c6956078106bfef933c2ae0967', '6ca5cab77e702c787b4c14b3d3bf26bad43da606be6eed04ab0b9720120ae081', '28391d3bc64ec15cbb090426b04aa6b7649c3cc85f11230bb0105e02d15e3624', '8f27f432fcbaa4b5180a1cc7a8fa166a93cda3c1bce6f19922dd519d02f4bb39', '0695b563acde461fc2f8d9aebccf35c7596ac458b8d8e067c602fb7b4e5f1578', '26a8ab9a939d64d5be458908afe0fb13d1ae0a1dc6561a1ddf0a827565718f62', 'b8d31e852725afb1e26d53bab6095b2bff1749c9275be13ed1c05a56ed31ec09', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'c2333a7e3a607935c67c1e6f6810395decc9f66f592b812aaada7db94ba215d6', 'fa6cff0bff3adc572b2cfb409ed7ad6320f3a595eeb2afd8d730b6ec442db873', '944c27e5b97ab7793e4b6e9ff29384890ece0c7c04d2e2bf81c5f763469cc66b']
const lengths = [1, 5, 5, 2, 3, 3, 9, 8, 1, 5, 5, 3, 1, 9, 4, 1, 8, 4, 2, 6, 4, 7, 2, 1, 5, 6, 3]

const guessedWords = new Array(words.length).fill(false);
const displayWords = new Array(words.length).fill("");

const imageElement = document.getElementById("game-image");
const sentenceContainer = document.getElementById("sentence-container");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const guessArea = document.querySelector(".guess-area");
const message = document.getElementById("message");

imageElement.src = imagePath;

function renderSentence() {

    sentenceContainer.innerHTML = "";

    for (let i = 0; i < words.length; i++) {
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
    const userGuess = guessInput.value.trim();

    if (userGuess === "") {
        return;
    }

    const hashedGuess = await sha256(userGuess);

    for (let i = 0; i < words.length; i++) {
        if (words[i] === hashedGuess) {
            guessedWords[i] = true;
            displayWords[i] = userGuess;
        }
    }

    guessInput.value = "";

    renderSentence();
    checkWin();
    saveGame();
}

function checkWin() {
    if (!guessedWords.includes(false)) {
        guessArea.style.display = "none";
        message.textContent = "You solved it!";
    }
}

async function sha256(word) {
  const msgBuffer = new TextEncoder().encode(word);

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer)); 
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
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

loadGame();
renderSentence();
checkWin();