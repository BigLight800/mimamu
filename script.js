const puzzleId = "image_4"
const storageKey = `mimamu_${puzzleId}`;
const imagePath = "images/image4.png";

const words = ['9f98b7c7f071714517d9a5e67c135b41fa3e91f20bac108158b33b073396f6e5', 'ec482f96672a2fe71f419362e515fff8be413aba5b630f51cb41da3df854ffd0', '939bd3930c04c4b5a382216d62e117e9b4b77a83a3bb065007767078d940f7fd', '086a96d512be58b10bf1abaed3df57ef5a7bec3ffacfd88a45bd6854dfa816f2', '073380b1948492eecb0c8357036e2e5b38956bcaaeae569467a84275314dce91', 'b1d6b91b67c2afa5e322988d9462638d354ddf8a1ef79dba987f815c22b4baee', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '84e77d60b3dda3859587fc9643a3dd751eb422bcf9f25d6ef88e07b00b8111c0', '4cd6c2914887dd4a68e4c9ffbed8b077f048cf795d6cfa0b801d43e0ea5a1560', '779e8fad22b71376b1b28f127963b02d76540cf311ae05a947506d122afceaf0', '5fb6a47e368e12e5d8b19280796e6a3d146fe391ed2e967d5f95c55bfb0f9c2f', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'acd6beff7c3430bfed5d69f86c5c9e6a32ad2a27a2c2a1e8763ce08f6c3da5ec', 'e5909c3cc473fb34a1af4470eb9f01091191aaa7aa625dcd637708ca303b9af6', '6008c26f4452392acb19374bc12a5ec0c360ae17356bce8b786fb128c8720951', 'b48111c10c65fc119368edafb19f97451759ee90b3f44647368135ca47aa4753', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', '6a5c06a9ebd213b1dead01b4fd691c1fedd6de55347783c90025c52ccd69c02a', 'dcbbefb7b80f0caf758ca749548046e0dded6f2780b6c8cfc9671c7a383e04a5', '28391d3bc64ec15cbb090426b04aa6b7649c3cc85f11230bb0105e02d15e3624', '354cbfc814262a7a81d343f7d6ebc4adfb4266e5081a78f6a19ff16802dce8b2', '78690a04e855a956a1649ba10ab9ada54ee18348d6f1d7f4bc9d526f1bb36d08', '0695b563acde461fc2f8d9aebccf35c7596ac458b8d8e067c602fb7b4e5f1578', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'fdcd4bfab1994990306b31a7db85e2fa85ff8680b162f34ee53fbb37456a4dc2', '6201111b83a0cb5b0922cb37cc442b9a40e24e3b1ce100a4bb204f4c63fd2ac0', '73e37401a920a9381f643a1ab4e40266590af729c9a37c1c13a8567c633ecdc7', '97e1f3fc7beaed63fc4ae087b78f13a31b2c0c925747f7713ed067b1e7d289a1', '74c0b16c94daee7acc35cbd8852cc0070743df8523e1c44360ec085513373228', '0cfcdc2f0991b0be44828249e5a914c80d7d1975d1238729f8b360839090953c', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'f811eb5c56eeb90a48b9dfc01b860424a8c7b4bd349119d07a8969dd7811b127', '6201111b83a0cb5b0922cb37cc442b9a40e24e3b1ce100a4bb204f4c63fd2ac0', '73c2d5472488dcdb947c0b224678f82c8f7c18b36dd262564b4c791604aef9f1', '176ca52906b001daa816562988464d2af4e18590a85bc7090e28ad3faccb7f8c']
const lengths = [2, 10, 7, 6, 8, 2, 1, 8, 6, 8, 4, 1, 5, 5, 6, 5, 1, 9, 10, 2, 3, 10, 4, 1, 8, 3, 7, 4, 7, 9, 1, 5, 3, 9, 7]

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